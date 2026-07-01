const DATE_ONLY_TIME_ZONE = "UTC";

export function parseDateInputAsDateOnly(value: string) {
    const [year, month, day] = value.split("-").map(Number);

    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

export function formatDateOnly(date: Date) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: DATE_ONLY_TIME_ZONE,
    }).format(date);
}

export function formatDateTimePY(date: Date) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Asuncion",
    }).format(date);
}

export function getTodayDateOnly() {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Asuncion",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const year = Number(parts.find((part) => part.type === "year")?.value);
    const month = Number(parts.find((part) => part.type === "month")?.value);
    const day = Number(parts.find((part) => part.type === "day")?.value);

    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

export function addDaysToDateOnly(date: Date, days: number) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);

    return result;
}

export function addMonthsToDateOnly(date: Date, months: number) {
    const result = new Date(date);

    const originalDay = result.getUTCDate();

    result.setUTCMonth(result.getUTCMonth() + months);

    if (result.getUTCDate() !== originalDay) {
        result.setUTCDate(0);
    }

    return result;
}

export function toDateInputValue(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}