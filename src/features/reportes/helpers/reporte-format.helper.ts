import { formatDateOnly } from "@/lib/date/date-only";

export function formatReporteMontoPYG(value: number) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0,
    }).format(value);
}

export function getReporteAmountClassName(value: number) {
    if (value > 0) {
        return "text-emerald-700";
    }

    if (value < 0) {
        return "text-rose-700";
    }

    return "text-foreground";
}

export function formatReporteFecha(date: Date) {
    return formatDateOnly(date);
}