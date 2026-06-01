import os
import time
from pathlib import Path

from google import genai
from google.genai import types, errors as genai_errors
from fastapi import APIRouter
from pydantic import BaseModel

from app.api.routes.courses import get_course
from app.api.routes.planner import get_planned_courses
from app.api.routes.requirements import get_degree_audit
from app.knowledge.retrieval import retrieve_context

router = APIRouter()

_resume = (Path(__file__).parent.parent.parent / "context" / "resume.txt").read_text()

_BASE_SYSTEM = f"""You are a personal academic and career advisor for Bryan Phan at Washington University in St. Louis.

STUDENT PROFILE:
- Rising Junior, B.S. Computer Science + Finance Minor
- GPA: 3.96/4.0, ~80 credits completed
- Career Goal: Backend/Cloud Engineering at major tech companies (Google, Meta, Amazon, Apple, Microsoft)
- Target: Junior Summer Internship (Summer 2027)

RESUME:
{_resume}

You have real-time tools to check Bryan's degree progress, planned courses, and course details.
Use them when answering questions about requirements or course planning.
Give specific, actionable advice tailored to Bryan's backend/cloud internship goal by Summer 2027.
When relevant research context is provided below, use it to give concrete, data-backed answers — cite specific timelines, numbers, and tactics from it."""

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
        description="Details about a specific course by its code (e.g. 'CSE247', 'CSE332L').",
        parameters=types.Schema(
            type=types.Type.OBJECT,
            properties={
                "course_code": types.Schema(
                    type=types.Type.STRING,
                    description="The course code, e.g. 'CSE247'",
                )
            },
            required=["course_code"],
        ),
    ),
])]


def _run_tool(name: str, args: dict) -> dict:
    try:
        if name == "get_degree_audit":
            return {"result": get_degree_audit()}
        if name == "get_remaining_requirements":
            audit = get_degree_audit()
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
            return {"result": get_planned_courses()}
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
                time.sleep(2 ** attempt)  # 1s, 2s, 4s
                continue
            raise


class ChatMessage(BaseModel):
    message: str
    history: list[dict] = []


@router.post("/")
def chat(body: ChatMessage):
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

        # Append model's tool-call turn to history
        model_parts = []
        for p in parts:
            if p.function_call is not None:
                model_parts.append({
                    "function_call": {"name": p.function_call.name, "args": dict(p.function_call.args or {})}
                })
            elif p.text:
                model_parts.append({"text": p.text})
        contents.append({"role": "model", "parts": model_parts})

        # Execute tools and append results
        fn_parts = [
            {
                "function_response": {
                    "name": fc.name,
                    "response": _run_tool(fc.name, dict(fc.args or {})),
                }
            }
            for fc in function_calls
        ]
        contents.append({"role": "user", "parts": fn_parts})

    return {"reply": "Reached tool call limit. Please try a more specific question.", "history": contents}
