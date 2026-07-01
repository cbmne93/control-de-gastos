import { formatDateOnly } from "@/lib/date/date-only";

export function formatDashboardMontoPYG(value: number) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatDashboardFecha(date: Date) {
    return formatDateOnly(date);
}