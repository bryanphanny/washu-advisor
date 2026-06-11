from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user, require_admin
from app.database import get_db

router = APIRouter()


class AIAccessUpdate(BaseModel):
    can_use_ai: bool


@router.get("/me")
def get_my_permissions(current_user_id: str = Depends(get_current_user)):
    db = get_db()
    result = db.table("user_permissions").select("role, can_use_ai").eq("user_id", current_user_id).execute()
    if not result.data:
        return {"role": "user", "can_use_ai": False, "is_admin": False}
    p = result.data[0]
    return {"role": p["role"], "can_use_ai": p["can_use_ai"], "is_admin": p["role"] == "admin"}


@router.get("/users")
def list_users(current_user_id: str = Depends(get_current_user)):
    require_admin(current_user_id)
    db = get_db()

    perms = db.table("user_permissions").select("*").order("created_at").execute().data

    # Fetch emails from Supabase Auth admin API
    try:
        auth_users = db.auth.admin.list_users()
        email_map = {u.id: u.email for u in auth_users}
    except Exception:
        email_map = {}

    return [
        {
            "user_id":    p["user_id"],
            "email":      email_map.get(p["user_id"], "unknown"),
            "role":       p["role"],
            "can_use_ai": p["can_use_ai"],
            "created_at": p["created_at"],
        }
        for p in perms
    ]


@router.patch("/users/{user_id}/ai-access")
def set_ai_access(user_id: str, body: AIAccessUpdate, current_user_id: str = Depends(get_current_user)):
    require_admin(current_user_id)
    db = get_db()
    result = db.table("user_permissions").update({"can_use_ai": body.can_use_ai}).eq("user_id", user_id).execute()
    return result.data[0]


@router.post("/claim-existing-data")
def claim_existing_data(current_user_id: str = Depends(get_current_user)):
    """
    One-time migration: assigns all semesters/user_courses that have no
    user_id to the calling admin account (Bryan's existing seed data).
    Safe to call multiple times — only touches NULL rows.
    """
    require_admin(current_user_id)
    db = get_db()

    sem_result = db.table("semesters").update({"user_id": current_user_id}).is_("user_id", "null").execute()
    uc_result  = db.table("user_courses").update({"user_id": current_user_id}).is_("user_id", "null").execute()

    return {
        "semesters_claimed":    len(sem_result.data),
        "user_courses_claimed": len(uc_result.data),
    }
