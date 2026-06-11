from fastapi import Header, HTTPException
from app.database import get_db


def get_current_user(authorization: str = Header(None)) -> str:
    """Extract and verify the Supabase JWT. Returns the user's UUID."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    db = get_db()
    try:
        response = db.auth.get_user(token)
        return response.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_admin(current_user_id: str) -> None:
    """Raise 403 if the user is not an admin."""
    db = get_db()
    result = db.table("user_permissions").select("role").eq("user_id", current_user_id).execute()
    if not result.data or result.data[0]["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
