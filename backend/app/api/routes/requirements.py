from fastapi import APIRouter, Depends
from app.database import get_db
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/")
def get_requirements(program: str | None = None):
    db = get_db()
    query = db.table("requirement_categories").select("*, requirements(*)")
    if program:
        query = query.eq("program", program)
    return query.execute().data


@router.get("/audit")
def get_degree_audit(current_user_id: str = Depends(get_current_user)):
    return _compute_audit(current_user_id)


def _compute_audit(user_id: str) -> list:
    """Internal audit computation — also called directly from chat tools."""
    db = get_db()
    categories = db.table("requirement_categories").select(
        "*, requirements(*)"
    ).execute().data

    completed = db.table("user_courses").select("*").eq("user_id", user_id).eq("is_planned", False).execute().data
    planned   = db.table("user_courses").select("*").eq("user_id", user_id).eq("is_planned", True).execute().data

    completed_codes = {
        c["course_code"] for c in completed
        if c["grade"] not in (None, "W", "CR#")
    }
    planned_codes = {c["course_code"] for c in planned}

    total_completed_credits = sum(
        c["credits"] for c in completed
        if c["grade"] not in (None, "W")
    )
    total_planned_credits = sum(c["credits"] for c in planned)

    audit = []
    for cat in categories:
        if cat["name"] == "Total Credits to Graduate":
            total = total_completed_credits + total_planned_credits
            credits_needed = max(0, (cat["credits_required"] or 0) - total)
            audit.append({
                "category": cat["name"],
                "program": cat["program"],
                "credits_required": cat["credits_required"],
                "notes": cat["notes"],
                "satisfied_required": [],
                "planned_required": [],
                "unsatisfied_required": [],
                "satisfied_electives": [],
                "planned_electives": [],
                "elective_credits_still_needed": credits_needed,
                "is_complete": total >= (cat["credits_required"] or 0),
                "total_completed_credits": total_completed_credits,
                "total_planned_credits": total_planned_credits,
            })
            continue

        reqs     = cat.get("requirements", [])
        required  = [r for r in reqs if r["is_required"]]
        electives = [r for r in reqs if not r["is_required"]]

        satisfied_required   = [r for r in required  if r["course_code"] in completed_codes]
        planned_required     = [r for r in required  if r["course_code"] in planned_codes and r["course_code"] not in completed_codes]
        unsatisfied_required = [r for r in required  if r["course_code"] not in completed_codes and r["course_code"] not in planned_codes]
        satisfied_elective   = [r for r in electives if r["course_code"] in completed_codes]
        planned_elective     = [r for r in electives if r["course_code"] in planned_codes and r["course_code"] not in completed_codes]

        credits_from_required  = sum(r["credits"] for r in satisfied_required)  + sum(r["credits"] for r in planned_required)
        credits_from_electives = sum(r["credits"] for r in satisfied_elective) + sum(r["credits"] for r in planned_elective)
        elective_needed = (cat["credits_required"] or 0) - credits_from_required - credits_from_electives

        audit.append({
            "category": cat["name"],
            "program": cat["program"],
            "credits_required": cat["credits_required"],
            "notes": cat["notes"],
            "satisfied_required": satisfied_required,
            "planned_required": planned_required,
            "unsatisfied_required": unsatisfied_required,
            "satisfied_electives": satisfied_elective,
            "planned_electives": planned_elective,
            "elective_credits_still_needed": max(0, elective_needed),
            "is_complete": len(unsatisfied_required) == 0 and elective_needed <= 0,
        })

    return audit
