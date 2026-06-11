from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import courses, requirements, planner, chat, admin

app = FastAPI(title="WashU Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(requirements.router, prefix="/api/requirements", tags=["requirements"])
app.include_router(planner.router, prefix="/api/planner", tags=["planner"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

@app.get("/health")
def health():
    return {"status": "ok"}
