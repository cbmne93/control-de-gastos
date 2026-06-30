import type { NotificacionFilterValue } from "@/features/notificaciones/types/notificacion.types";

export function normalizeNotificacionFilter(
    filter?: string
): NotificacionFilterValue {
    if (
        filter === "SIN_LEER" ||
        filter === "LEIDAS" ||
        filter === "CUOTA_VENCIDA" ||
        filter === "CUOTA_POR_VENCER"
    ) {
        return filter;
    }

    return "TODAS";
}