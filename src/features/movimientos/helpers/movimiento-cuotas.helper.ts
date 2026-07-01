import { addMonthsToDateOnly } from "@/lib/date/date-only";

export function addMonthsToDate(date: Date, months: number) {
    return addMonthsToDateOnly(date, months);
}

export function generarMontosCuotas(montoTotal: number, cantidadCuotas: number) {
    const montoEntero = Math.round(montoTotal);
    const base = Math.floor(montoEntero / cantidadCuotas);
    const resto = montoEntero % cantidadCuotas;

    return Array.from({ length: cantidadCuotas }, (_, index) => {
        return index === cantidadCuotas - 1 ? base + resto : base;
    });
}

export function generarFechasVencimiento(
    fechaPrimerVencimiento: Date,
    cantidadCuotas: number
) {
    return Array.from({ length: cantidadCuotas }, (_, index) => {
        return addMonthsToDate(fechaPrimerVencimiento, index);
    });
}