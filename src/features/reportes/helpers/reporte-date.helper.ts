import { getTodayDateOnly } from "@/lib/date/date-only";
import type { ReportePeriodo } from "@/features/reportes/types/reporte.types";

export function getCurrentPeriodo(): ReportePeriodo {
    const today = getTodayDateOnly();

    return {
        month: today.getUTCMonth() + 1,
        year: today.getUTCFullYear(),
    };
}

export function normalizeReportePeriodo(
    month?: string,
    year?: string
): ReportePeriodo {
    const currentPeriodo = getCurrentPeriodo();

    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    return {
        month:
            parsedMonth >= 1 && parsedMonth <= 12
                ? parsedMonth
                : currentPeriodo.month,
        year:
            parsedYear >= 2000 && parsedYear <= 2100
                ? parsedYear
                : currentPeriodo.year,
    };
}

export function getReporteMonthRange(periodo: ReportePeriodo) {
    const startOfMonth = new Date(
        Date.UTC(periodo.year, periodo.month - 1, 1, 0, 0, 0, 0)
    );

    const startOfNextMonth = new Date(
        Date.UTC(periodo.year, periodo.month, 1, 0, 0, 0, 0)
    );

    return {
        startOfMonth,
        startOfNextMonth,
    };
}

export function getMonthName(month: number) {
    const date = new Date(Date.UTC(2026, month - 1, 1, 0, 0, 0, 0));

    return new Intl.DateTimeFormat("es-PY", {
        month: "long",
        timeZone: "UTC",
    }).format(date);
}

export function getReporteTitle(periodo: ReportePeriodo) {
    const monthName = getMonthName(periodo.month);

    return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${periodo.year}`;
}