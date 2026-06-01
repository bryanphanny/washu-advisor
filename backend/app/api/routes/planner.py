from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_db

router = APIRouter()


class PlannedCourse(BaseModel):
    semester_id: int
    course_code: str
    course_name: str
    credits: float


class GradeUpdate(BaseModel):
    grade: str | None = None
    grade_points: float | None = None


@router.get("/semesters")
def get_semesters():
    db = get_db()
    return db.table("semesters").select("*").order("id").execute().data


@router.get("/")
def get_planned_courses():
    db = get_db()
    return db.table("user_courses").select(
        "*, semesters(term, year)"
    ).eq("is_planned", True).execute().data


@router.get("/all")
def get_all_user_courses():
    db = get_db()
    return db.table("user_courses").select(
        "*, semesters(term, year)"
    ).order("semester_id").execute().data


@router.post("/")
def add_planned_course(course: PlannedCourse):
    db = get_db()
    result = db.table("user_courses").insert({
        **course.model_dump(),
        "is_planned": True,
    }).execute()
    return result.data[0]


@router.delete("/{course_id}")
def remove_planned_course(course_id: int):
    db = get_db()
    row = db.table("user_courses").select("*").eq("id", course_id).eq("is_planned", True).execute().data
    if not row:
        raise HTTPException(status_code=404, detail="Planned course not found")
    db.table("user_courses").delete().eq("id", course_id).execute()
    return {"deleted": course_id}


@router.patch("/{course_id}/grade")
def set_course_grade(course_id: int, body: GradeUpdate):
    db = get_db()
    result = db.table("user_courses").update({
        "grade": body.grade,
        "grade_points": body.grade_points,
    }).eq("id", course_id).execute()
    return result.data[0]


@router.patch("/{course_id}/move")
def move_course(course_id: int, semester_id: int):
    db = get_db()
    result = db.table("user_courses").update(
        {"semester_id": semester_id}
    ).eq("id", course_id).execute()
    return result.data[0]
