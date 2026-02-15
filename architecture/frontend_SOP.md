# Frontend SOP (Standard Operating Procedure)

## 1. Tech Stack
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI based)
- **State Management:** React Query (TanStack Query) for server state, Context for global app state (if needed).

## 2. Directory Structure
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── output/        # Markdown viewer, export buttons
│   │   ├── settings/      # Config forms
│   │   └── jira/          # Ticket display cards
│   ├── hooks/             # Custom hooks (useJira, useLLM)
│   ├── services/          # API client (Axios/Fetch)
│   ├── pages/             # Route components
│   └── types/             # TS interfaces
```

## 3. Key Workflows
- **Ticket Fetch:** User enters ID -> Hook calls API -> Loading State -> Display Data.
- **Generation:** User selects Template + Provider -> Hook calls API -> Stream Response -> Update Editor.
- **Settings:** Form updates -> API call to save -> Toast notification.

## 4. UX Guidelines
- **Loading:** Use Skeletons for data fetching, Spinners for actions.
- **Errors:** Show Toast notifications for API errors.
- **Markdown:** Render generated test plans with a clean, typography-focused plugin.
