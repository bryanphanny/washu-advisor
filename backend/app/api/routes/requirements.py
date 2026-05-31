from fastapi import APIRouter
from app.database import get_db

router = APIRouter()


@router.get("/")
def get_requirements(program: str | None = None):
    db = get_db()
    query = db.table("requirement_categories").select(
        "*, requirements(*)"
    )
    if program:
        query = query.eq("program", program)
    return query.execute().data


@router.get("/audit")
def get_degree_audit():
    """
    Returns a structured audit: for each requirement category,
    which courses are satisfied and which are still needed.
    """
    db = get_db()
    categories = db.table("requirement_categories").select(
        "*, requirements(*)"
    ).execute().data

    completed = db.table("user_courses").select("*").eq("is_planned", False).execute().data
    completed_codes = {
        c["course_code"] for c in completed
        if c["grade"] not in (None, "W", "CR#")
    }

    audit = []
    for cat in categories:
        reqs = cat.get("requirements", [])
        required = [r for r in reqs if r["is_required"]]
        electives = [r for r in reqs if not r["is_required"]]

        satisfied_required = [r for r in required if r["course_code"] in completed_codes]
        unsatisfied_required = [r for r in required if r["course_code"] not in completed_codes]

        # For elective groups, check if at least one is satisfied
        satisfied_elective = [r for r in electives if r["course_code"] in completed_codes]
        credits_from_required = sum(r["credits"] for r in satisfied_required)
        credits_from_electives = sum(r["credits"] for r in satisfied_elective)
        elective_needed = (cat["credits_required"] or 0) - credits_from_required - credits_from_electives

        audit.append({
            "category": cat["name"],
            "program": cat["program"],
            "credits_required": cat["credits_required"],
            "notes": cat["notes"],
            "satisfied_required": satisfied_required,
            "unsatisfied_required": unsatisfied_required,
            "satisfied_electives": satisfied_elective,
            "elective_credits_still_needed": max(0, elective_needed),
            "is_complete": len(unsatisfied_required) == 0 and elective_needed <= 0,
        })

    return audit
