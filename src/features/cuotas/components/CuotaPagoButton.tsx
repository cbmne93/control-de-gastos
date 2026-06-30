"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";

import type { EstadoCuotaValue } from "@/features/cuotas/types/cuota.types";

interface CuotaPagoButtonProps {
    cuotaId: string;
    estado: EstadoCuotaValue;
    isPending: boolean;
    onMarcarPagada: (id: string) => void;
    onRestaurarPendiente: (id: string) => void;
    fullWidth?: boolean;
}

export function CuotaPagoButton({
    cuotaId,
    estado,
    isPending,
    onMarcarPagada,
    onRestaurarPendiente,
    fullWidth = false,
}: CuotaPagoButtonProps) {
    if (estado === "PAGADA") {
        return (
            <button
                type="button"
                onClick={() => onRestaurarPendiente(cuotaId)}
                disabled={isPending}
                className={[
                    "inline-flex items-center justify-center gap-2 rounded-xl border border-(--app-border) bg-(--app-card) px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary) disabled:cursor-not-allowed disabled:opacity-60",
                    fullWidth ? "w-full" : "",
                ].join(" ")}
            >
                <RotateCcw className="h-4 w-4" />
                Restaurar
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => onMarcarPagada(cuotaId)}
            disabled={isPending}
            className={[
                "inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60",
                fullWidth ? "w-full" : "",
            ].join(" ")}
        >
            <CheckCircle2 className="h-4 w-4" />
            Marcar pagada
        </button>
    );
}