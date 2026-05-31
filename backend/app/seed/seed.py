"""
Run once to populate the database with all seed data.
Usage: python -m app.seed.seed
"""
from app.database import get_db

db = get_db()


# ---------------------------------------------------------------------------
# 1. SEMESTERS
# ---------------------------------------------------------------------------
SEMESTERS = [
    {"term": "Fall",   "year": 2024, "is_completed": True},
    {"term": "Spring", "year": 2025, "is_completed": True},
    {"term": "Fall",   "year": 2025, "is_completed": True},
    {"term": "Spring", "year": 2026, "is_completed": True},
    {"term": "Fall",   "year": 2026, "is_completed": False},
    {"term": "Spring", "year": 2027, "is_completed": False},
    {"term": "Fall",   "year": 2027, "is_completed": False},
    {"term": "Spring", "year": 2028, "is_completed": False},
]

# ---------------------------------------------------------------------------
# 2. TRANSCRIPT (Bryan's completed coursework)
# ---------------------------------------------------------------------------
TRANSCRIPT = [
    # Transfer credits (AP)
    {"term": "Transfer", "year": 0, "is_transfer": True, "courses": [
        {"code": "MATH 131",    "name": "Calculus I",                          "credits": 3.0, "grade": "Exam Credit"},
        {"code": "MATH 132",    "name": "Calculus II",                         "credits": 3.0, "grade": "Exam Credit"},
        {"code": "BIOL 100A",   "name": "An Introduction to Biology",          "credits": 6.0, "grade": "Exam Credit"},
        {"code": "HISTORY 0001","name": "History Elective",                    "credits": 3.0, "grade": "Exam Credit"},
        {"code": "HISTORY 163", "name": "Freedom, Citizenship and the Making of American Life", "credits": 3.0, "grade": "Exam Credit"},
    ]},
    # Fall 2024
    {"term": "Fall", "year": 2024, "is_completed": True, "courses": [
        {"code": "CHEM 105",   "name": "Principles of General Chemistry I",    "credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "CHEM 105P",  "name": "Peer-Led Team-Learning: Gen Chem I",   "credits": 1.0, "grade": "CR#",  "grade_points": None},
        {"code": "CHEM 151",   "name": "General Chemistry Laboratory I",       "credits": 2.0, "grade": "A",    "grade_points": 4.0},
        {"code": "CWP 118",    "name": "College Writing: Technology & Selfhood","credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "PSYCH 100B", "name": "Introduction to Psychology",           "credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "SDS 2200",   "name": "Elementary Probability and Statistics", "credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "BIOL 2651",  "name": "MedPrep I-The Lecture Series",         "credits": 1.0, "grade": "CR#",  "grade_points": None},
        {"code": "FYP 181",    "name": "First-Year Opportunity: Research in Biology", "credits": 1.0, "grade": "CR#", "grade_points": None},
        {"code": "GEST 1100",  "name": "Bearprints for Success",               "credits": 1.0, "grade": "CR#",  "grade_points": None},
    ]},
    # Spring 2025
    {"term": "Spring", "year": 2025, "is_completed": True, "courses": [
        {"code": "AAS 206",    "name": "Topics in AMCS",                       "credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "BIOL 2960",  "name": "Principles of Biology I",              "credits": 4.0, "grade": "A",    "grade_points": 4.0},
        {"code": "CHEM 106",   "name": "Principles of General Chemistry II",   "credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "CHEM 106P",  "name": "Peer-Led Team-Learning: Gen Chem II",  "credits": 1.0, "grade": "CR#",  "grade_points": None},
        {"code": "CHEM 152",   "name": "General Chemistry Laboratory II",      "credits": 2.0, "grade": "A",    "grade_points": 4.0},
        {"code": "ECON 1011",  "name": "Introduction to Microeconomics",       "credits": 3.0, "grade": "A",    "grade_points": 4.0},
    ]},
    # Fall 2025
    {"term": "Fall", "year": 2025, "is_completed": True, "courses": [
        {"code": "ANTHRO 1520","name": "Introduction to Cultural Anthropology", "credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "CSE 1301",   "name": "Introduction to Computer Science",     "credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "CSE 2107",   "name": "Introduction to Data Science",         "credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "CSE 2407",   "name": "Data Structures and Algorithms",       "credits": 3.0, "grade": "A+",   "grade_points": 4.0},
        {"code": "GENST 2970", "name": "Seminar in Academic Mentoring",        "credits": 1.0, "grade": "Pass", "grade_points": None},
        {"code": "MATH 2130",  "name": "Calculus III",                         "credits": 3.0, "grade": "B+",   "grade_points": 3.3},
        {"code": "MATH 3300",  "name": "Matrix Algebra (Withdrawn)",           "credits": 3.0, "grade": "W",    "grade_points": None},
    ]},
    # Spring 2026
    {"term": "Spring", "year": 2026, "is_completed": True, "courses": [
        {"code": "CSE 1302",   "name": "Introduction to Computer Engineering", "credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "CSE 2400",   "name": "Logic and Discrete Mathematics",       "credits": 3.0, "grade": "A",    "grade_points": 4.0},
        {"code": "CSE 3302",   "name": "Object-Oriented Software Development Laboratory", "credits": 3.0, "grade": "A+", "grade_points": 4.0},
        {"code": "MATH 3300",  "name": "Matrix Algebra",                       "credits": 3.0, "grade": "A",    "grade_points": 4.0},
    ]},
]

# ---------------------------------------------------------------------------
# 3. CS MAJOR REQUIREMENT CATEGORIES
# ---------------------------------------------------------------------------
REQUIREMENT_CATEGORIES = [
    {"name": "CS Core",              "program": "CS_MAJOR", "credits_required": 21.0, "notes": "All 7 courses required. C- or better."},
    {"name": "Systems Elective",     "program": "CS_MAJOR", "credits_required": 3.0,  "notes": "Choose 1. C- or better."},
    {"name": "Methods Elective",     "program": "CS_MAJOR", "credits_required": 3.0,  "notes": "Choose 1. C- or better."},
    {"name": "Technical Electives",  "program": "CS_MAJOR", "credits_required": 15.0, "notes": "5 CSE courses. At least 2 must be 4000+. Up to 6 units from approved non-CSE courses."},
    {"name": "Mathematics",          "program": "CS_MAJOR", "credits_required": 15.0, "notes": "All 5 math courses required."},
    {"name": "College Writing",      "program": "CS_MAJOR", "credits_required": 3.0,  "notes": "CWP 1500 or equivalent. CWP 118 satisfies this."},
    {"name": "Technical Writing",    "program": "CS_MAJOR", "credits_required": 3.0,  "notes": "ENGR 3100 being removed — replaced by 3 additional humanities credits."},
    {"name": "Natural Sciences",     "program": "CS_MAJOR", "credits_required": 8.0,  "notes": "8 units of natural science electives. Already satisfied."},
    {"name": "Humanities & Social Sciences", "program": "CS_MAJOR", "credits_required": 18.0, "notes": "18 units. Already satisfied."},
    # Finance Minor
    {"name": "Finance Core",         "program": "FINANCE_MINOR", "credits_required": 12.0, "notes": "4 required courses."},
    {"name": "Finance Elective",     "program": "FINANCE_MINOR", "credits_required": 3.0,  "notes": "Choose 1 from approved list."},
]

# ---------------------------------------------------------------------------
# 4. SPECIFIC REQUIREMENTS
# ---------------------------------------------------------------------------
CS_CORE = [
    ("CSE 1301", "Introduction to Computer Science",                    3.0),
    ("CSE 1302", "Introduction to Computer Engineering",                3.0),
    ("CSE 2400", "Logic and Discrete Mathematics",                      3.0),
    ("CSE 2407", "Data Structures and Algorithms",                      3.0),
    ("CSE 3302", "Object-Oriented Software Development Laboratory",     3.0),
    ("CSE 3407", "Analysis of Algorithms",                              3.0),
    ("CSE 3601", "Introduction to Systems Software",                    3.0),
]

SYSTEMS_ELECTIVES = [
    ("CSE 4202", "Operating Systems Organization",          3.0),
    ("CSE 4205", "Programming Systems and Languages",       3.0),
    ("CSE 4301", "Translation of Computer Languages",       3.0),
    ("CSE 4303", "Introduction to Computer Security",       3.0),
    ("CSE 4304", "Reverse Engineering and Malware Analysis",3.0),
    ("CSE 4703", "Introduction to Computer Networks",       3.0),
]

METHODS_ELECTIVES = [
    ("CSE 2506", "Introduction to Human-Centered Design",   3.0),
    ("CSE 4101", "AI and Society",                          3.0),
    ("CSE 4102", "Introduction to Artificial Intelligence", 3.0),
    ("CSE 4106", "Data Science for Complex Networks",       3.0),
    ("CSE 4107", "Introduction to Machine Learning",        3.0),
    ("CSE 4402", "Introduction to Cryptography",            3.0),
    ("CSE 4507", "Introduction to Visualization",           3.0),
    ("CSE 4608", "Introduction to Quantum Computing",       3.0),
]

MATH_REQUIREMENTS = [
    ("MATH 131",  "Calculus I",                             3.0),
    ("MATH 132",  "Calculus II",                            3.0),
    ("MATH 2130", "Calculus III",                           3.0),
    ("MATH 3300", "Matrix Algebra",                         3.0),
    ("ESE 3260",  "Probability and Statistics",             3.0),
]

FINANCE_CORE = [
    ("ACCT 2610", "Principles of Financial Accounting",    3.0),
    ("FIN 3150",  "Capital Markets and Financial Management", 3.0),
    ("FIN 4410",  "Investments",                           3.0),
    ("FIN 4480",  "Advanced Financial Management",         3.0),
]

# ---------------------------------------------------------------------------
# 5. FULL CSE COURSE CATALOG
# ---------------------------------------------------------------------------
CSE_COURSES = [
    ("CSE 1007",  "Data Science Playground",                               1.0),
    ("CSE 1301",  "Introduction to Computer Science",                      3.0),
    ("CSE 1302",  "Introduction to Computer Engineering",                  3.0),
    ("CSE 1391",  "Seminar: Computer Science I",                           1.0),
    ("CSE 1392",  "Seminar: Computer Science II",                          1.0),
    ("CSE 2000",  "Engineering and Scientific Computing",                  3.0),
    ("CSE 2004",  "Web Development",                                       3.0),
    ("CSE 2107",  "Introduction to Data Science",                          3.0),
    ("CSE 2201",  "Internet of Things",                                    3.0),
    ("CSE 2301",  "Introduction to Parallel and Concurrent Programming",   3.0),
    ("CSE 2302",  "Programming Skills Workshop",                           1.0),
    ("CSE 2307",  "Programming Tools and Techniques",                      3.0),
    ("CSE 2400",  "Logic and Discrete Mathematics",                        3.0),
    ("CSE 2402",  "Discrete Math Seminar",                                 3.0),
    ("CSE 2407",  "Data Structures and Algorithms",                        3.0),
    ("CSE 2497",  "Seminar: Data Structures and Algorithms",               1.0),
    ("CSE 2506",  "Introduction to Human-Centered Design",                 3.0),
    ("CSE 2600",  "Introduction to Digital Logic and Computer Design",     3.0),
    ("CSE 3050",  "Responsible Data Science",                              3.0),
    ("CSE 3058",  "Programming Usable Interfaces",                         3.0),
    ("CSE 3101",  "Introduction to Intelligent Agents Using Science Fiction",3.0),
    ("CSE 3103",  "Artificial Intelligence Lab",                           3.0),
    ("CSE 3104",  "Data Manipulation and Management",                      3.0),
    ("CSE 3106",  "Social Network Analysis",                               3.0),
    ("CSE 3300",  "Rapid Prototype Development and Creative Programming",  3.0),
    ("CSE 3302",  "Object-Oriented Software Development Laboratory",       3.0),
    ("CSE 3401",  "Parallel and Sequential Algorithms",                    3.0),
    ("CSE 3407",  "Analysis of Algorithms",                                3.0),
    ("CSE 3601",  "Introduction to Systems Software",                      3.0),
    ("CSE 3602",  "Computer Architecture",                                 3.0),
    ("CSE 3605",  "Elements of Computing Systems",                         3.0),
    ("CSE 4001",  "Independent Study",                                     6.0),
    ("CSE 4027",  "Introduction to Natural Language Processing",           3.0),
    ("CSE 4059",  "Applied Parallel Programming: GPUs",                    3.0),
    ("CSE 4061",  "Text Mining",                                           3.0),
    ("CSE 4101",  "AI and Society",                                        3.0),
    ("CSE 4102",  "Introduction to Artificial Intelligence",               3.0),
    ("CSE 4103",  "Web Privacy and Security",                              3.0),
    ("CSE 4106",  "Data Science for Complex Networks",                     3.0),
    ("CSE 4107",  "Introduction to Machine Learning",                      3.0),
    ("CSE 4109",  "Introduction to AI for Health",                         3.0),
    ("CSE 4202",  "Operating Systems Organization",                        3.0),
    ("CSE 4205",  "Programming Systems and Languages",                     3.0),
    ("CSE 4207",  "Cloud Computing With Big Data Applications",            3.0),
    ("CSE 4208",  "Multi-Paradigm Programming in C++",                     3.0),
    ("CSE 4301",  "Translation of Computer Languages",                     3.0),
    ("CSE 4303",  "Introduction to Computer Security",                     3.0),
    ("CSE 4304",  "Reverse Engineering and Malware Analysis",              3.0),
    ("CSE 4305",  "Database Management Systems",                           3.0),
    ("CSE 4307",  "Software Engineering Workshop",                         3.0),
    ("CSE 4308",  "Mobile Application Development",                        3.0),
    ("CSE 4393",  "Seminar: Capture the Flag (CTF) Studio",               1.0),
    ("CSE 4397",  "Technical Interviewing",                                2.0),
    ("CSE 4402",  "Introduction to Cryptography",                          3.0),
    ("CSE 4470",  "Introduction to Formal Languages and Automata",         3.0),
    ("CSE 4500",  "Video Game Programming",                                3.0),
    ("CSE 4502",  "Computer Graphics",                                     3.0),
    ("CSE 4504",  "Software Engineering for External Clients",             3.0),
    ("CSE 4507",  "Introduction to Visualization",                         3.0),
    ("CSE 4600",  "Switching Theory",                                      3.0),
    ("CSE 4602",  "Computer Systems Design",                               3.0),
    ("CSE 4607",  "Embedded Computing Systems",                            3.0),
    ("CSE 4608",  "Introduction to Quantum Computing",                     3.0),
    ("CSE 4690",  "Security of the Internet of Things",                    3.0),
    ("CSE 4703",  "Introduction to Computer Networks",                     3.0),
    ("CSE 4970",  "Senior Project I",                                      3.0),
    ("CSE 4971",  "Senior Project II",                                     3.0),
    ("CSE 4975",  "Undergraduate Honors Thesis",                           3.0),
]

FINANCE_COURSES = [
    # Required
    ("ACCT 2610", "Principles of Financial Accounting",          3.0, "ACCT"),
    ("FIN 3150",  "Capital Markets and Financial Management",    3.0, "FIN"),
    ("FIN 4410",  "Investments",                                 3.0, "FIN"),
    ("FIN 4480",  "Advanced Financial Management",               3.0, "FIN"),
    # Electives
    ("FIN 3175",  "Banking and Financial Institutions",          3.0, "FIN"),
    ("FIN 4010",  "Advanced Valuation",                          1.5, "FIN"),
    ("FIN 4023",  "Venture Capital Methods",                     1.5, "FIN"),
    ("FIN 4024",  "Venture Capital Practice",                    1.5, "FIN"),
    ("FIN 4025",  "Private Equity Methods",                      1.5, "FIN"),
    ("FIN 4026",  "Private Equity Practice",                     1.5, "FIN"),
    ("FIN 4232",  "Mergers and Acquisitions",                    1.5, "FIN"),
    ("FIN 4280",  "Investment Praxis",                           3.0, "FIN"),
    ("FIN 4370",  "Advanced Derivative Securities",              3.0, "FIN"),
    ("FIN 4400",  "Real Estate Finance",                         1.5, "FIN"),
    ("FIN 4430",  "International Finance",                       3.0, "FIN"),
    ("FIN 4506",  "Financial Technology: Methods and Practice",  3.0, "FIN"),
    ("FIN 4510",  "Options, Futures and Derivative Securities",  3.0, "FIN"),
    ("FIN 4601",  "Research Methods in Finance",                 3.0, "FIN"),
]

FINANCE_ELECTIVES = [
    ("FIN 3175",  "Banking and Financial Institutions",          3.0),
    ("FIN 4010",  "Advanced Valuation",                          1.5),
    ("FIN 4023",  "Venture Capital Methods",                     1.5),
    ("FIN 4024",  "Venture Capital Practice",                    1.5),
    ("FIN 4025",  "Private Equity Methods",                      1.5),
    ("FIN 4026",  "Private Equity Practice",                     1.5),
    ("FIN 4232",  "Mergers and Acquisitions",                    1.5),
    ("FIN 4280",  "Investment Praxis",                           3.0),
    ("FIN 4370",  "Advanced Derivative Securities",              3.0),
    ("FIN 4400",  "Real Estate Finance",                         1.5),
    ("FIN 4430",  "International Finance",                       3.0),
    ("FIN 4506",  "Financial Technology: Methods and Practice",  3.0),
    ("FIN 4510",  "Options, Futures and Derivative Securities",  3.0),
    ("FIN 4601",  "Research Methods in Finance",                 3.0),
]


def seed_all():
    print("Seeding semesters...")
    for s in SEMESTERS:
        db.table("semesters").upsert(s, on_conflict="term,year").execute()

    print("Seeding course catalog...")
    db.table("courses").insert([
        {"code": code, "name": name, "credits": credits, "department": "CSE"}
        for code, name, credits in CSE_COURSES
    ] + [
        {"code": code, "name": name, "credits": credits, "department": dept}
        for code, name, credits, dept in FINANCE_COURSES
    ]).execute()

    print("Seeding requirement categories...")
    db.table("requirement_categories").insert(REQUIREMENT_CATEGORIES).execute()

    # fetch category ids
    cats = {
        r["name"]: r["id"]
        for r in db.table("requirement_categories").select("id,name").execute().data
    }

    print("Seeding requirements...")
    reqs = []
    for code, name, credits in CS_CORE:
        reqs.append({"category_id": cats["CS Core"], "course_code": code,
                     "course_name": name, "credits": credits, "is_required": True})
    for code, name, credits in SYSTEMS_ELECTIVES:
        reqs.append({"category_id": cats["Systems Elective"], "course_code": code,
                     "course_name": name, "credits": credits, "is_required": False,
                     "elective_group": "SYSTEMS_ELECTIVE"})
    for code, name, credits in METHODS_ELECTIVES:
        reqs.append({"category_id": cats["Methods Elective"], "course_code": code,
                     "course_name": name, "credits": credits, "is_required": False,
                     "elective_group": "METHODS_ELECTIVE"})
    for code, name, credits in MATH_REQUIREMENTS:
        reqs.append({"category_id": cats["Mathematics"], "course_code": code,
                     "course_name": name, "credits": credits, "is_required": True})
    for code, name, credits in FINANCE_CORE:
        reqs.append({"category_id": cats["Finance Core"], "course_code": code,
                     "course_name": name, "credits": credits, "is_required": True})
    for code, name, credits in FINANCE_ELECTIVES:
        reqs.append({"category_id": cats["Finance Elective"], "course_code": code,
                     "course_name": name, "credits": credits, "is_required": False,
                     "elective_group": "FINANCE_ELECTIVE"})
    db.table("requirements").insert(reqs).execute()

    print("Seeding transcript...")
    sem_ids = {
        (r["term"], r["year"]): r["id"]
        for r in db.table("semesters").select("id,term,year").execute().data
    }

    user_courses = []
    for period in TRANSCRIPT:
        term, year = period["term"], period["year"]
        is_transfer = period.get("is_transfer", False)
        sem_id = sem_ids.get((term, year))
        for c in period["courses"]:
            user_courses.append({
                "semester_id": sem_id,
                "course_code": c["code"],
                "course_name": c["name"],
                "credits": c["credits"],
                "grade": c.get("grade"),
                "grade_points": c.get("grade_points"),
                "is_transfer": is_transfer,
                "is_planned": False,
            })
    db.table("user_courses").insert(user_courses).execute()

    print("Done. All seed data inserted.")


if __name__ == "__main__":
    seed_all()
