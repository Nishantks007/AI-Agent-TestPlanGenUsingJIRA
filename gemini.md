# Project Constitution (gemini.md)

## 1. Vision (North Star)
Build a **Nexus Test Plan Generator**, a full-stack web application (React + FastAPI) that automates test plan creation by integrating **JIRA** ticket data with **LLM-powered analysis** (Groq/Ollama). The system uses customizable PDF templates to generate structured test plans.

## 2. Data Schemas

### Core Entities

**1. JiraTicket**
```json
{
  "key": "VWO-123",
  "summary": "Login page error",
  "description": "...",
  "priority": "High",
  "status": "in-progress",
  "assignee": "User Name",
  "acceptance_criteria": ["Criteria 1", "Criteria 2"],
  "labels": ["bug", "frontend"],
  "attachments": [{"filename": "log.txt", "url": "..."}]
}
```

**2. TestPlanTemplate**
```json
{
  "id": "uuid",
  "name": "Standard Test Plan",
  "content_structure": ["Introduction", "Scope", "Test Strategy", "Test Cases"],
  "raw_file_path": "/path/to/templates/testplan.pdf"
}
```

**3. GeneratedTestPlan**
```json
{
  "ticket_id": "VWO-123",
  "template_id": "uuid",
  "provider": "groq" | "ollama",
  "content_markdown": "# Test Plan for VWO-123...",
  "created_at": "timestamp"
}
```

## 3. Behavioral Rules & Constraints
- **Reliability:** Timeout handling (30s Groq, 120s Ollama) with retry logic (3 attempts).
- **Security:** API Keys must NOT be stored in Frontend. Use Backend environment variables or secure local storage.
- **LLM Context:** System prompt must instruct the LLM to map ticket details to template sections and generate specific scenarios based on acceptance criteria.
- **Privacy:** Localhost only. CORS restricted to local domain.

## 4. Architectural Invariants
- **Frontend:** React (Vite) + TypeScript + Tailwind + shadcn/ui.
- **Backend:** Python (FastAPI).
- **Storage:** SQLite (Settings/History) + File System (Templates).
- **Layer 1:** Architecture (`architecture/`) - Technical SOPs.
- **Layer 3:** Tools (`tools/`) - Deterministic Python scripts.
