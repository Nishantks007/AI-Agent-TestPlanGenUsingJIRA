import { useState } from "react";
import { generatePlan } from "../services/api";
import type { PlanResponse } from "../types";

export const useLLM = () => {
    const [plan, setPlan] = useState<PlanResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = async (ticketId: string, provider: "groq" | "ollama", model?: string, templateContent?: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await generatePlan({ ticket_id: ticketId, provider, model, template_content: templateContent });
            setPlan(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { plan, loading, error, generate };
};
