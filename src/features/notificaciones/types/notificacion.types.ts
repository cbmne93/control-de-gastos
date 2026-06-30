export type TipoNotificacionValue = "CUOTA_POR_VENCER" | "CUOTA_VENCIDA";

export type NotificacionFilterValue =
    | "TODAS"
    | "SIN_LEER"
    | "LEIDAS"
    | "CUOTA_VENCIDA"
    | "CUOTA_POR_VENCER";

export interface NotificacionListItem {
    id: string;
    titulo: string;
    mensaje: string;
    tipo: TipoNotificacionValue;
    leida: boolean;
    createdAt: Date;
    cuota: {
        id: string;
        numeroCuota: number;
        totalCuotas: number;
        fechaVencimiento: Date;
        movimiento: {
            id: string;
            descripcion: string;
        };
    } | null;
}

export interface NotificacionesStats {
    todas: number;
    sinLeer: number;
    leidas: number;
    cuotaVencida: number;
    cuotaPorVencer: number;
}

export interface NotificacionesPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
}