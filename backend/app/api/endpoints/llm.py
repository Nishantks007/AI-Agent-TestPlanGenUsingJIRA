from fastapi import APIRouter, HTTPException, BackgroundTasks
from backend.app.models.llm import GeneratePlanRequest, PlanResponse
from backend.app.services.jira_client import jira_service
from backend.app.services.llm_service import llm_service

router = APIRouter()

@router.post("/generate", response_model=PlanResponse)
async def generate_plan(request: GeneratePlanRequest):
    """
    Generate a Test Plan for a JIRA Ticket using Groq or Ollama.
    """
    try:
        # 1. Fetch Ticket Data
        ticket = await jira_service.get_ticket(request.ticket_id)
        
        # 2. Get Template (Use provided content or fallback)
        template_text = request.template_content or (
            "# Test Plan Template\n\n"
            "## 1. Introduction\n[Brief description of features]\n\n"
            "## 2. Scope\n- In Scope:\n- Out of Scope:\n\n"
            "## 3. Test Strategy\n[Approach, Tools, Environment]\n\n"
            "## 4. Test Scenarios\n| ID | Scenario | Expected Result |\n|----|----------|-----------------|\n"
        )
        
        # 3. Generate Plan
        generated_content = await llm_service.generate_test_plan(
            ticket=ticket,
            template_text=template_text,
            provider=request.provider,
            model=request.model
        )
        
        return PlanResponse(
            content=generated_content,
            provider=request.provider,
            model=request.model or ("llama-3.3-70b-versatile" if request.provider == "groq" else "default")
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
