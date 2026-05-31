from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ChatMessage(BaseModel):
    message: str
    history: list[dict] = []


@router.post("/")
def chat(body: ChatMessage):
    # Placeholder — Phase 3 wires in Claude API with tool_use
    return {
        "reply": "AI advisor coming in Phase 3.",
        "history": body.history + [
            {"role": "user", "content": body.message},
            {"role": "assistant", "content": "AI advisor coming in Phase 3."},
        ]
    }
