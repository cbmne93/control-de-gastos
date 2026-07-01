import {
    addDaysToDateOnly,
    getTodayDateOnly,
} from "@/lib/date/date-only";

export function getMonthRange() {
    const today = getTodayDateOnly();

    const startOfMonth = new Date(
        Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            1,
            0,
            0,
            0,
            0
        )
    );

    const startOfNextMonth = new Date(
        Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            1,
            0,
            0,
            0,
            0
        )
    );

    return {
        startOfMonth,
        startOfNextMonth,
    };
}

export function getTodayStart() {
    return getTodayDateOnly();
}

export function addDays(date: Date, days: number) {
    return addDaysToDateOnly(date, days);
}