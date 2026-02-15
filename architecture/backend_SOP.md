# Backend SOP (Standard Operating Procedure)

## 1. Directory Structure
```
backend/
├── app/
│   ├── main.py            # Entry point
│   ├── api/
│   │   ├── endpoints/     # Routers (jira, llm, templates)
│   ├── core/              # Config, Security
│   ├── models/            # Pydantic Schemas
│   ├── services/          # Business Logic (JiraClient, LLMService, PDFParser)
│   └── db/                # SQLite setup
├── templates/             # Storage for uploaded PDFs
└── requirements.txt
```

## 2. API Design Principles
- **RESTful:** Use standard HTTP methods (GET, POST).
- **Type Safety:** Use Pydantic models for all Request/Response bodies.
- **Error Handling:** Centralized exception handler returning structured JSON errors.
- **Async:** Use `async/await` for all I/O bound operations (JIRA API, LLM calls).

## 3. Core Modules
### A. JIRA Module
- **Purpose:** Fetch ticket details.
- **Input:** Ticket ID (e.g., "VWO-123").
- **Output:** Normalized `JiraTicket` object.

### B. LLM Module
- **Purpose:** Generate test plans.
- **Input:** `JiraTicket`, `TemplateStructure`, `Provider` (groq/ollama).
- **Process:** Assemble System Prompt -> Call Provider -> Stream/Return Response.
- **Output:** Markdown string.

### C. Template Module
- **Purpose:** Manage test plan templates.
- **Action:** Upload PDF -> Extract Text -> Store Metadata.
- **Library:** `PyMuPDF` (fitz).

## 4. Database
- **SQLite:** `app.db`
- **Tables:** `settings`, `history`, `templates`.
