export function getMonthRange() {
    const today = new Date();

    const startOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
        0,
        0,
        0,
        0
    );

    const startOfNextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1,
        0,
        0,
        0,
        0
    );

    return {
        startOfMonth,
        startOfNextMonth,
    };
}

export function getTodayStart() {
    const today = new Date();

    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
    );
}

export function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
}