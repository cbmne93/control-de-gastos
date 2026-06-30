import type { EstadoCuotaValue } from "@/features/cuotas/types/cuota.types";

export function formatMontoPYG(value: number) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatFechaCuota(date: Date) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

export function getEstadoCuotaLabel(estado: EstadoCuotaValue) {
    const labels: Record<EstadoCuotaValue, string> = {
        PENDIENTE: "Pendiente",
        PAGADA: "Pagada",
        VENCIDA: "Vencida",
    };

    return labels[estado];
}

export function getEstadoCuotaBadgeClass(estado: EstadoCuotaValue) {
    const classes: Record<EstadoCuotaValue, string> = {
        PENDIENTE: "border-amber-200 bg-amber-50 text-amber-700",
        PAGADA: "border-emerald-200 bg-emerald-50 text-emerald-700",
        VENCIDA: "border-rose-200 bg-rose-50 text-rose-700",
    };

    return classes[estado];
}

export function getCuotasProgressPercent(pagadas: number, total: number) {
    if (total === 0) {
        return 0;
    }

    return Math.round((pagadas / total) * 100);
}