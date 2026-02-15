from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import get_settings
from backend.app.api.endpoints import jira, llm, templates

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:3000", # Frontend
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(jira.router, prefix="/api/jira", tags=["jira"])
app.include_router(llm.router, prefix="/api/llm", tags=["llm"])
app.include_router(templates.router, prefix="/api/templates", tags=["templates"])

@app.get("/")
def read_root():
    return {"message": "Nexus Test Plan Generator API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
