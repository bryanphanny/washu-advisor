from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_db

router = APIRouter()


class CourseCreate(BaseModel):
    code: str
    name: str
    credits: float
    department: str = "CSE"
    description: str | None = None


@router.get("/")
def list_courses(department: str | None = None):
    db = get_db()
    query = db.table("courses").select("*")
    if department:
        query = query.eq("department", department)
    return query.order("code").execute().data


@router.get("/{code}")
def get_course(code: str):
    db = get_db()
    result = db.table("courses").select("*").eq("code", code).execute().data
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    return result[0]


@router.post("/")
def add_course(course: CourseCreate):
    db = get_db()
    result = db.table("courses").insert(course.model_dump()).execute()
    return result.data[0]


@router.delete("/{code}")
def delete_course(code: str):
    db = get_db()
    db.table("courses").delete().eq("code", code).execute()
    return {"deleted": code}
