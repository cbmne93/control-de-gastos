"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    variant?: "danger" | "default";
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    isLoading = false,
    variant = "default",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isLoading) {
                onCancel();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isLoading, onCancel, open]);

    if (!open) {
        return null;
    }

    const isDanger = variant === "danger";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
            role="presentation"
            onMouseDown={() => {
                if (!isLoading) {
                    onCancel();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
                className="w-full max-w-md overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-start gap-4 p-6">
                    <div
                        className={[
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1",
                            isDanger
                                ? "bg-rose-50 text-rose-700 ring-rose-100"
                                : "bg-(--app-primary-soft) text-(--app-primary) ring-(--app-primary-muted)",
                        ].join(" ")}
                    >
                        <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <h2
                                id="confirm-dialog-title"
                                className="text-lg font-bold text-foreground"
                            >
                                {title}
                            </h2>

                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isLoading}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-(--app-card-soft) hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                                aria-label="Cerrar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <p
                            id="confirm-dialog-description"
                            className="mt-2 text-sm leading-6 text-slate-500"
                        >
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-(--app-border) bg-(--app-card-soft) px-6 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-(--app-border) bg-(--app-card) px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary) disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={[
                            "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
                            isDanger
                                ? "bg-rose-600 hover:bg-rose-700"
                                : "bg-(--app-primary) hover:opacity-90",
                        ].join(" ")}
                    >
                        {isLoading ? "Procesando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}