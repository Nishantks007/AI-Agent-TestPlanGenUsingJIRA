# Task Plan

## 🟢 Protocol 0: Initialization
- [x] **Initialize Project Memory:** `task_plan.md`, `findings.md`, `progress.md`, `gemini.md`.
- [x] **Discovery:** Analyzed `template/prompt.md`.

## 🏗️ Phase 1: B - Blueprint (Vision & Logic)
- [x] **Data Schema:** Defined in `gemini.md`.
- [ ] **Architecture Definition:** Define API structure and Frontend/Backend interaction in `architecture/`.

## ⚡ Phase 2: L - Link (Connectivity)
- [ ] **Environment Setup:** Create `.env` with JIRA, GROQ, and OLLAMA credentials.
- [ ] **Backend Skeleton:** Initialize FastAPI app.
- [ ] **JIRA Connector:** Verify connection to JIRA API `https://ai-vault.atlassian.net/`.
- [ ] **LLM Connector:** Verify connection to Groq and local Ollama (`http://localhost:11434`).

## ⚙️ Phase 3: A - Architect (The Build)
### Backend (FastAPI)
- [ ] **Settings Module:** endpoints for saving/testing credentials.
- [ ] **JIRA Module:** Fetch ticket details, parse content.
- [ ] **Template Module:** PDF upload and parsing (Text Extraction).
- [ ] **Generator Module:** LLM Prompt construction and streaming response.

### Frontend (React + Vite)
- [ ] **Setup:** Initialize project with Tailwind and shadcn/ui.
- [ ] **Settings Panel:** JIRA/LLM config forms.
- [ ] **Workflow UI:** Ticket Input -> Data Display -> Generation Controls.
- [ ] **Output View:** Markdown editor/preview.

## ✨ Phase 4: S - Stylize (Refinement & UI)
- [ ] **UI Polish:** Apply "Clean, professional QA/Testing aesthetic".
- [ ] **Feedback Loops:** Toast notifications, loading states.

## 🛰️ Phase 5: T - Trigger (Deployment)
- [x] **Documentation:** Setup instructions for Ollama, Keys, and Running the app (In README.md).
- [x] **Final Review:** Verify against Success Criteria (Maintenance Log in gemini.md).
- [x] **Export Logic:** Implemented .md download for generated plans.
