export interface JiraTicket {
    key: string;
    summary: string;
    description?: string;
    priority: string;
    status: string;
    assignee: string;
    acceptance_criteria: string[];
    labels: string[];
    attachments: {
        filename: string;
        url: string;
        mime_type: string;
    }[];
}

export interface PlanRequest {
    ticket_id: string;
    provider: "groq" | "ollama";
    model?: string;
    template_content?: string;
}

export interface PlanResponse {
    content: string;
    provider: string;
    model: string;
}
