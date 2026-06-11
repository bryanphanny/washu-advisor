import os
import time

from google import genai
from google.genai import types, errors as genai_errors
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.api.routes.courses import get_course
from app.api.routes.requirements import _compute_audit
from app.database import get_db
from app.knowledge.retrieval import retrieve_context

router = APIRouter()

_BASE_SYSTEM = """You are an AI academic advisor for Washington University in St. Louis students.

You help students with:
- Understanding and planning their degree requirements
- Choosing courses and electives
- Academic policies (add/drop, withdrawals, grading)
- General career and internship preparation advice for CS and business students
- Graduation planning and timeline

You have real-time tools to check the student's live degree progress, planned courses, and course catalog details.
Always use these tools when answering questions about the student's specific requirements or course plan.

Be helpful, specific, and actionable. When relevant context is provided below, use it to give concrete answers.
Do not reference any specific student by name or make assumptions about a student's background beyond what their degree audit shows."""

_TOOLS = [types.Tool(function_declarations=[
    types.FunctionDeclaration(
        name="get_degree_audit",
        description="Full degree audit showing satisfied and unsatisfied requirements across all categories.",
    ),
    types.FunctionDeclaration(
        name="get_remaining_requirements",
        description="Only the incomplete degree requirements — unsatisfied required courses and elective credit gaps.",
    ),
    types.FunctionDeclaration(
        name="get_planned_courses",
        description="Courses currently planned in future semesters.",
    ),
    types.FunctionDeclaration(
        name="get_course_info",
        description="Details about a specific course by its code.",
        parameters=types.Schema(
            type=types.Type.OBJECT,
            properties={
                "course_code": types.Schema(
                    type=types.Type.STRING,
                    description="The course code, e.g. 'CSE 4107'",
                )
            },
            required=["course_code"],
        ),
    ),
])]


def _run_tool(name: str, args: dict, user_id: str) -> dict:
    try:
        if name == "get_degree_audit":
            return {"result": _compute_audit(user_id)}
        if name == "get_remaining_requirements":
            audit = _compute_audit(user_id)
            return {"result": [
                {
                    "category": c["category"],
                    "program": c["program"],
                    "unsatisfied_required": c["unsatisfied_required"],
                    "elective_credits_still_needed": c["elective_credits_still_needed"],
                }
                for c in audit if not c["is_complete"]
            ]}
        if name == "get_planned_courses":
            db = get_db()
            return {"result": db.table("user_courses").select(
                "*, semesters(term, year)"
            ).eq("user_id", user_id).eq("is_planned", True).execute().data}
        if name == "get_course_info":
            return {"result": get_course(args.get("course_code", ""))}
    except Exception as e:
        return {"error": str(e)}
    return {"error": f"Unknown tool: {name}"}


def _generate_with_retry(client: genai.Client, contents, config, max_attempts: int = 4):
    for attempt in range(max_attempts):
        try:
            return client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
                config=config,
            )
        except genai_errors.ServerError as e:
            if attempt < max_attempts - 1 and "503" in str(e):
                time.sleep(2 ** attempt)
                continue
            raise


class ChatMessage(BaseModel):
    message: str
    history: list[dict] = []


@router.post("/")
def chat(body: ChatMessage, current_user_id: str = Depends(get_current_user)):
    db = get_db()
    perm = db.table("user_permissions").select("can_use_ai").eq("user_id", current_user_id).execute()
    if not perm.data or not perm.data[0]["can_use_ai"]:
        raise HTTPException(status_code=403, detail="AI advisor access not enabled for your account")

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    rag_context = retrieve_context(body.message, client)
    system_prompt = _BASE_SYSTEM
    if rag_context:
        system_prompt += f"\n\nRELEVANT RESEARCH CONTEXT:\n\n{rag_context}"

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        tools=_TOOLS,
        max_output_tokens=8192,
    )

    contents = list(body.history) + [{"role": "user", "parts": [{"text": body.message}]}]

    for _ in range(8):
        response = _generate_with_retry(client, contents, config)

        parts = response.candidates[0].content.parts
        function_calls = [p.function_call for p in parts if p.function_call is not None]

        if not function_calls:
            reply = "".join(p.text for p in parts if p.text)
            contents.append({"role": "model", "parts": [{"text": reply}]})
            return {"reply": reply, "history": contents}

        model_parts = []
        for p in parts:
            if p.function_call is not None:
                model_parts.append({
                    "function_call": {"name": p.function_call.name, "args": dict(p.function_call.args or {})}
                })
            elif p.text:
                model_parts.append({"text": p.text})
        contents.append({"role": "model", "parts": model_parts})

        fn_parts = [
            {
                "function_response": {
                    "name": fc.name,
                    "response": _run_tool(fc.name, dict(fc.args or {}), current_user_id),
                }
            }
            for fc in function_calls
        ]
        contents.append({"role": "user", "parts": fn_parts})

    return {"reply": "Reached tool call limit. Please try a more specific question.", "history": contents}
