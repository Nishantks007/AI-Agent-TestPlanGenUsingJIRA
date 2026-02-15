import type { JiraTicket, PlanRequest, PlanResponse } from "../types";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const fetchTicket = async (ticketId: string): Promise<JiraTicket> => {
    const response = await fetch(`${API_BASE_URL}/jira/fetch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticket_id: ticketId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch ticket");
    }

    return response.json();
};

export const generatePlan = async (request: PlanRequest): Promise<PlanResponse> => {
    const response = await fetch(`${API_BASE_URL}/llm/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to generate plan");
    }

    return response.json();
};

export interface UploadResponse {
    filename: string;
    content: string;
    message: string;
}

export const uploadTemplate = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/templates/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to upload template");
    }

    return response.json();
};
