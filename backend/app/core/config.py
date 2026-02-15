from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Nexus Test Plan Generator"
    
    # JIRA
    JIRA_BASE_URL: str
    JIRA_API_TOKEN: str
    JIRA_EMAIL: str
    
    # LLM
    GROQ_API_KEY: str
    OLLAMA_BASE_URL: str = "http://localhost:11434"

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()
