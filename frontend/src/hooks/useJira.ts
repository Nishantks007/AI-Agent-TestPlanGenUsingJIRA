import { useState } from "react";
import { fetchTicket } from "../services/api";
import type { JiraTicket } from "../types";

export const useJira = () => {
    const [ticket, setTicket] = useState<JiraTicket | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getTicket = async (ticketId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTicket(ticketId);
            setTicket(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { ticket, loading, error, getTicket };
};
