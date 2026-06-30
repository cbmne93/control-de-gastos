"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

interface SuccessAlertProps {
    message?: string | null;
    autoHideMs?: number;
}

export function SuccessAlert({
    message,
    autoHideMs = 4000,
}: SuccessAlertProps) {
    const [dismissedMessage, setDismissedMessage] = useState<string | null>(
        null,
    );

    const isVisible = Boolean(message && dismissedMessage !== message);

    useEffect(() => {
        if (!message || dismissedMessage === message) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setDismissedMessage(message);
        }, autoHideMs);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [message, dismissedMessage, autoHideMs]);

    if (!isVisible || !message) {
        return null;
    }

    return (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{message}</p>
            </div>

            <button
                type="button"
                onClick={() => setDismissedMessage(message)}
                className="rounded-lg p-1 text-emerald-700 transition hover:bg-emerald-100"
                aria-label="Cerrar alerta"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}