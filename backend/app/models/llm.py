from pydantic import BaseModel
from typing import Optional

class GeneratePlanRequest(BaseModel):
    ticket_id: str
    template_id: Optional[str] = None 
    template_content: Optional[str] = None # Added for custom template support
    provider: str = "groq" # or "ollama"
    model: Optional[str] = None # Override default model

class PlanResponse(BaseModel):
    content: str
    provider: str
    model: str
