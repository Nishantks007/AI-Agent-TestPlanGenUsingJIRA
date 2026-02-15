import httpx
from typing import Optional, Dict, Any
from backend.app.core.config import get_settings
from backend.app.models.jira import JiraTicket, JiraAttachment
import base64

settings = get_settings()

class JiraClient:
    def __init__(self):
        self.base_url = settings.JIRA_BASE_URL.rstrip('/')
        self.email = settings.JIRA_EMAIL
        self.api_token = settings.JIRA_API_TOKEN
        
        # Prepare Basic Auth header
        credentials = f"{self.email}:{self.api_token}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        self.headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

    async def get_ticket(self, ticket_id: str) -> JiraTicket:
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/rest/api/3/issue/{ticket_id}"
            params = {
                "fields": "summary,description,priority,status,assignee,labels,attachment" 
            }
            try:
                response = await client.get(url, headers=self.headers, params=params, timeout=15.0)
                response.raise_for_status()
                data = response.json()
                return self._parse_ticket_data(data)
            except httpx.HTTPStatusError as e:
                print(f"JIRA API Error: {e.response.text}")
                raise ValueError(f"Failed to fetch ticket {ticket_id}: {e.response.status_code}")
            except Exception as e:
                print(f"JIRA Client Error: {str(e)}")
                raise ValueError(f"Error connecting to JIRA: {str(e)}")

    def _parse_ticket_data(self, data: Dict[str, Any]) -> JiraTicket:
        fields = data.get('fields', {})
        
        # Extract basic fields
        key = data.get('key')
        summary = fields.get('summary', 'No Summary')
        
        # Description can be complex rich text in Jira v3, or simpler.
        # We need to handle basic extraction. For v3, description is a doc structure.
        # This is a simplified extractor.
        description_raw = fields.get('description')
        description = self._extract_text_from_adf(description_raw) if description_raw else "No description provided."

        priority = fields.get('priority', {}).get('name', 'Medium')
        status = fields.get('status', {}).get('name', 'Unknown')
        
        assignee = "Unassigned"
        if fields.get('assignee'):
             assignee = fields.get('assignee').get('displayName', 'Unassigned')

        labels = fields.get('labels', [])
        
        # Attachments
        attachments = []
        if fields.get('attachment'):
            for att in fields.get('attachment'):
                attachments.append(JiraAttachment(
                    filename=att.get('filename'),
                    url=att.get('content'),
                    mime_type=att.get('mimeType', 'application/octet-stream')
                ))

        # Acceptance Criteria (Custom Field - difficult to guess, usually customfield_XXXXX)
        # For now, we will look for it in the description or leave empty.
        # Providing a placeholder mechanism.
        acceptance_criteria = [] 
        # TODO: Implement custom field logic if ID is known.

        return JiraTicket(
            key=key,
            summary=summary,
            description=description,
            priority=priority,
            status=status,
            assignee=assignee,
            labels=labels,
            attachments=attachments,
            acceptance_criteria=acceptance_criteria
        )

    def _extract_text_from_adf(self, adf_node: Dict[str, Any]) -> str:
        """
        Recursively extract text from Atlassian Document Format (ADF) json.
        """
        if not adf_node:
            return ""
        
        text = ""
        node_type = adf_node.get('type')

        if node_type == 'text':
            return adf_node.get('text', '')
        
        if 'content' in adf_node:
            for child in adf_node['content']:
                text += self._extract_text_from_adf(child)
                
        if node_type == 'paragraph':
            text += "\n"
            
        return text

jira_service = JiraClient()
