import {
    formatDateOnly,
    formatDateTimePY,
} from "@/lib/date/date-only";
import type { TipoNotificacionValue } from "@/features/notificaciones/types/notificacion.types";

export function getTipoNotificacionLabel(tipo: TipoNotificacionValue) {
    const labels: Record<TipoNotificacionValue, string> = {
        CUOTA_POR_VENCER: "Cuota por vencer",
        CUOTA_VENCIDA: "Cuota vencida",
    };

    return labels[tipo];
}

export function getTipoNotificacionBadgeClass(tipo: TipoNotificacionValue) {
    const classes: Record<TipoNotificacionValue, string> = {
        CUOTA_POR_VENCER: "border-amber-200 bg-amber-50 text-amber-700",
        CUOTA_VENCIDA: "border-rose-200 bg-rose-50 text-rose-700",
    };

    return classes[tipo];
}

export function formatNotificacionFecha(date: Date) {
    return formatDateTimePY(date);
}

export function formatFechaVencimiento(date: Date) {
    return formatDateOnly(date);
}