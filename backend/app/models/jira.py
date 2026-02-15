from pydantic import BaseModel
from typing import List, Optional

class JiraAttachment(BaseModel):
    filename: str
    url: str
    mime_type: str = "application/octet-stream"

class JiraTicket(BaseModel):
    key: str
    summary: str
    description: Optional[str] = None
    priority: Optional[str] = "Medium"
    status: str
    assignee: str = "Unassigned"
    acceptance_criteria: Optional[List[str]] = []
    labels: List[str] = []
    attachments: List[JiraAttachment] = []

class TicketRequest(BaseModel):
    ticket_id: str
