"""
Seed the courses table from WashU's bulletin API.

Pulls course code, title, credits, description, curriculum attributes
(NSM, HUM, SSC, ETH, LCD, etc.), and typical offering periods for every
course in the subjects listed below.

Usage (from backend/):
    python -m app.seed.seed_courses

Before running:
    1. Run the SQL migration in supabase/migrations/add_course_attributes.sql
    2. Make sure backend/.env has SUPABASE_URL and SUPABASE_SERVICE_KEY set
"""

import json
import re
import ssl
import time
import urllib.request
from app.database import get_db

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SRCDB = "2025"          # Bulletin year (2025 = 2025-26 academic year)
REQUEST_DELAY = 0.4     # Seconds between detail requests (be polite)

# Subjects to seed. Format: (subject_code, department_label, max_course_level)
# max_course_level: 4999 = undergrad only, 9999 = all (grad too)
SUBJECTS = [
    # Core CS major
    ("CSE",     "CSE",      9999),   # All CSE including grad offerings

    # Math requirements
    ("MATH",    "MATH",     4999),
    ("ESE",     "ESE",      4999),   # ESE 3260 stats option
    ("SDS",     "SDS",      4999),   # SDS 3020 stats option
    ("ENGR",    "ENGR",     4999),   # ENGR 3100 technical writing

    # Natural Sciences (NSM requirement)
    ("PHYSICS", "PHYSICS",  4999),
    ("CHEM",    "CHEM",     4999),
    ("BIOL",    "BIOL",     4999),

    # College Writing requirement
    ("CWP",     "CWP",      4999),

    # H&SS — Humanities (HUM)
    ("PHIL",    "PHIL",     4999),
    ("HISTORY", "HISTORY",  4999),
    ("FILM",    "FILM",     4999),
    ("MUSIC",   "MUSIC",    4999),
    ("ART",     "ART",      4999),

    # H&SS — Social Sciences (SSC)
    ("PSYCH",   "PSYCH",    4999),
    ("SOC",     "SOC",      4999),
    ("ECON",    "ECON",     4999),
    ("ANTHRO",  "ANTHRO",   4999),
    ("WGSS",    "WGSS",     4999),
    ("AFAS",    "AFAS",     4999),

    # Language & Cultural Diversity (LCD)
    ("SPAN",    "SPAN",     4999),
    ("GERMAN",  "GERMAN",   4999),

    # Finance minor
    ("FIN",     "FIN",      4999),
    ("ACCT",    "ACCT",     4999),
    ("MGT",     "MGT",      4999),   # MGT 4101 capstone
    ("MEC",     "MEC",      4999),   # Microeconomics options
]

# WashU curriculum designator codes → what they mean
# These appear as "A&S: NSM", "BU: HUM", "EN: H", etc. in the description HTML
ATTR_KEYWORDS = {
    "NSM": "NSM",   # Natural Sciences & Mathematics
    "HUM": "HUM",   # Humanities
    "SSC": "SSC",   # Social & Behavioral Sciences
    "ETH": "ETH",   # Ethics (subset of HUM, specific requirement)
    "LCD": "LCD",   # Language & Cultural Diversity
    "WI":  "WI",    # Writing Intensive
    "SCI": "SCI",   # Science (Engineering school label)
    "AN":  "AN",    # Analytical (A&S label)
}

# ---------------------------------------------------------------------------
# Bulletin API helpers
# ---------------------------------------------------------------------------

_ssl_ctx = ssl._create_unverified_context()


def _post(endpoint: str, body: dict) -> dict | list:
    url = f"https://bulletin.wustl.edu/course-search/api/?page=fose&route={endpoint}"
    payload = json.dumps(body).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, context=_ssl_ctx) as resp:
        return json.loads(resp.read())


def search_subject(subject: str) -> list[dict]:
    """Return all courses for a subject from the search API."""
    result = _post("search", {
        "other": {"srcdb": SRCDB},
        "criteria": [{"field": "subject", "value": subject}],
    })
    return result.get("results", [])


def fetch_details(code: str) -> dict:
    """Return full detail dict for a single course code."""
    result = _post("details", {"group": f"code:{code}", "srcdb": SRCDB})
    if isinstance(result, list):
        return result[0] if result else {}
    return result


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

def _strip_html(html: str) -> str:
    return re.sub(r"<[^>]+>", "", html or "").strip()


def parse_credits(description_html: str) -> float | None:
    m = re.search(r"Credit\s+(\d+(?:\.\d+)?)\s+unit", description_html, re.IGNORECASE)
    return float(m.group(1)) if m else None


def parse_attributes(description_html: str) -> list[str]:
    """Extract curriculum designator codes from the crs_attrstr span."""
    attrs = set()
    # The attribute block looks like: A&S IQ: NSM, AN  or  BU: ETH, HUM  or  EN: H
    attr_block = re.search(r'class="crs_attrstr">(.*?)</span>', description_html, re.DOTALL)
    if attr_block:
        text = _strip_html(attr_block.group(1)).replace("&amp;", "&")
        for keyword, code in ATTR_KEYWORDS.items():
            if re.search(rf"\b{keyword}\b", text):
                attrs.add(code)
    return sorted(attrs)


def parse_description(description_html: str) -> str:
    """Return clean description text, stripping credit/period lines."""
    clean = _strip_html(description_html)
    clean = re.sub(r"Credit\s+\d+(?:\.\d+)?\s+units?.*", "", clean, flags=re.DOTALL)
    clean = re.sub(r"Typical periods offered:.*", "", clean, flags=re.DOTALL)
    return clean.strip()


def course_level(code: str) -> int:
    """Return the course number as an int (e.g. 'CSE 4202' → 4202)."""
    m = re.search(r"\d+", code.split()[-1])
    return int(m.group()) if m else 0


# ---------------------------------------------------------------------------
# Main seed logic
# ---------------------------------------------------------------------------

def seed_courses():
    db = get_db()
    total_upserted = 0
    total_skipped = 0

    for subject, department, max_level in SUBJECTS:
        print(f"\n── {subject} ({'all levels' if max_level >= 9999 else f'up to {max_level}'}) ──")

        search_results = search_subject(subject)
        # Filter by level
        filtered = [r for r in search_results if course_level(r["code"]) <= max_level]
        # Skip placeholder/admin courses (0xxx range)
        filtered = [r for r in filtered if course_level(r["code"]) >= 1000]

        print(f"   {len(filtered)} courses to process (of {len(search_results)} total)")

        batch = []
        for i, result in enumerate(filtered):
            code = result["code"]
            try:
                details = fetch_details(code)
                desc_html = details.get("description", "")

                credits = parse_credits(desc_html)
                if credits is None:
                    # Fall back to a sensible default if not parseable
                    credits = 1.0 if re.search(r"seminar|recitation", result.get("title", ""), re.IGNORECASE) else 3.0

                attributes = parse_attributes(desc_html)
                description = parse_description(desc_html)

                batch.append({
                    "code":        code,
                    "name":        details.get("title") or result.get("title", ""),
                    "credits":     credits,
                    "description": description or None,
                    "department":  department,
                    "attributes":  attributes,
                })

                if (i + 1) % 10 == 0:
                    print(f"   {i+1}/{len(filtered)} fetched...")

                time.sleep(REQUEST_DELAY)

            except Exception as e:
                print(f"   WARN: {code} — {e}")
                total_skipped += 1
                continue

        if batch:
            # Upsert so this script is safe to re-run
            db.table("courses").upsert(batch, on_conflict="code").execute()
            total_upserted += len(batch)
            print(f"   ✓ {len(batch)} courses upserted")

    print(f"\n{'='*50}")
    print(f"Done. {total_upserted} courses upserted, {total_skipped} skipped.")


if __name__ == "__main__":
    seed_courses()
