import {useState, useRef } from "react";

export default function usePost() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const abortRef = useRef(null);

    const post = async (url, body) => {
        setLoading(true);
        setError(null);
        setData(null);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body ?? {}),
                signal: controller.signal
            })

            if (!res.ok) {
                const message = await res.text();
                throw new Error(message);
            }

            const response = await res.json();
            setData(response || null);
            return response || null;
        } catch (error) {
            if (error?.name === "AbortError") return;
            setError(error.message || error.toString() || 'Bir hata oluştu');
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    return {loading, error, data, post};
}