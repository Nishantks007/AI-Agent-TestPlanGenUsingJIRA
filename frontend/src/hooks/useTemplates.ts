import { useState } from "react";
import { uploadTemplate } from "../services/api";

export const useTemplates = () => {
    const [templateContent, setTemplateContent] = useState<string | null>(null);
    const [filename, setFilename] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upload = async (file: File) => {
        setLoading(true);
        setError(null);
        try {
            const data = await uploadTemplate(file);
            setTemplateContent(data.content);
            setFilename(data.filename);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setTemplateContent(null);
        setFilename(null);
        setLoading(false);
        setError(null);
    };

    return { templateContent, filename, loading, error, upload, reset };
};
