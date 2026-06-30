type MovimientoTipo = "INGRESO" | "GASTO";

export function getMovimientoTipoLabel(tipo: MovimientoTipo) {
    const labels: Record<MovimientoTipo, string> = {
        INGRESO: "Ingreso",
        GASTO: "Gasto",
    };

    return labels[tipo];
}

export function getMovimientoTipoBadgeClass(tipo: MovimientoTipo) {
    const classes: Record<MovimientoTipo, string> = {
        INGRESO: "border-emerald-200 bg-emerald-50 text-emerald-700",
        GASTO: "border-rose-200 bg-rose-50 text-rose-700",
    };

    return classes[tipo];
}

export function formatMontoPYG(value: number) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatFechaMovimiento(date: Date) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

export function parseMontoToNumber(value: string) {
    const normalizedValue = value.replace(/\./g, "").replace(",", ".");
    return Number(normalizedValue);
}