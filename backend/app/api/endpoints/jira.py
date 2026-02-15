from fastapi import APIRouter, HTTPException, Depends
from backend.app.models.jira import JiraTicket, TicketRequest
from backend.app.services.jira_client import jira_service

router = APIRouter()

@router.post("/fetch", response_model=JiraTicket)
async def fetch_ticket(request: TicketRequest):
    """
    Fetch a JIRA ticket by ID (Key).
    """
    try:
        ticket = await jira_service.get_ticket(request.ticket_id)
        return ticket
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
