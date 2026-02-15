import os
import httpx
from groq import AsyncGroq
from backend.app.core.config import get_settings
from backend.app.models.jira import JiraTicket

settings = get_settings()

class LLMService:
    def __init__(self):
        self.groq_api_key = settings.GROQ_API_KEY
        self.ollama_base_url = settings.OLLAMA_BASE_URL
        
        # Initialize Groq client
        if self.groq_api_key:
            self.groq_client = AsyncGroq(api_key=self.groq_api_key)
        else:
            self.groq_client = None

    async def generate_test_plan(self, ticket: JiraTicket, template_text: str, provider: str = "groq", model: str = None) -> str:
        
        # Construct Prompt
        system_prompt = (
            "You are a Senior QA Engineer. Your task is to generate a comprehensive test plan "
            "based on the provided JIRA ticket details and the structure of the template below.\n\n"
            "INSTRUCTIONS:\n"
            "1. Map ticket details (Summary, Description, Acceptance Criteria) to appropriatete template sections.\n"
            "2. Maintain the template's formatting and sections EXACTLY.\n"
            "3. Add specific test scenarios, including positive, negative, and edge cases.\n"
            "4. Use professional technical language.\n"
        )
        
        user_content = (
            f"### JIRA TICKET DATA\n"
            f"Key: {ticket.key}\n"
            f"Summary: {ticket.summary}\n"
            f"Description: {ticket.description}\n"
            f"Priority: {ticket.priority}\n"
            f"Status: {ticket.status}\n"
            f"Acceptance Criteria: {ticket.acceptance_criteria}\n\n"
            f"### TEMPLATE STRUCTURE\n"
            f"{template_text}\n\n"
            f"Please generate the full test plan in Markdown format."
        )

        if provider == "groq":
            return await self._call_groq(system_prompt, user_content, model)
        elif provider == "ollama":
            return await self._call_ollama(system_prompt, user_content, model)
        else:
            raise ValueError(f"Invalid provider: {provider}")

    async def _call_groq(self, system_prompt: str, user_content: str, model: str = None) -> str:
        if not self.groq_client:
            raise ValueError("Groq Client not initialized (Missing API Key)")
        
        target_model = model or "llama-3.3-70b-versatile" 
        
        try:
            chat_completion = await self.groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                model=target_model,
                temperature=0.7,
                max_tokens=4096,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            raise ValueError(f"Groq API Error: {str(e)}")

    async def _call_ollama(self, system_prompt: str, user_content: str, model: str = None) -> str:
        target_model = model or "llama3" # Default
        url = f"{self.ollama_base_url}/api/chat"
        
        payload = {
            "model": target_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            "stream": False 
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload, timeout=120.0)
                response.raise_for_status()
                data = response.json()
                return data.get('message', {}).get('content', '')
            except Exception as e:
                raise ValueError(f"Ollama API Error: {str(e)}")

llm_service = LLMService()
