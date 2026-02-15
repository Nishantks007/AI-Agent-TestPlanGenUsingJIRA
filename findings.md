# Findings & Research

## Tech Stack Decisions
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend:** Python, FastAPI.
- **Database:** SQLite (local settings & history).
- **LLM:** Groq (Cloud), Ollama (Local).
- **PDF Parsing:** Need to select a robust library (e.g., `pypdf`, `pdfplumber`, or `fitz`/PyMuPDF). *Decision required.*

## Constraints
- **Local Deployment:** The app is a local web server tool.
- **JIRA:** V3 REST API. Requires API Token.
- **Security:** No API keys in frontend code.

## Resources
- **JIRA Base URL:** `https://ai-vault.atlassian.net/`
- **Ollama Base URL:** `http://localhost:11434`
