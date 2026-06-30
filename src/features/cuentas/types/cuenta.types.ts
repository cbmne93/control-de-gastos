export type TipoCuentaValue =
    | "EFECTIVO"
    | "BANCO"
    | "BILLETERA"
    | "TARJETA_CREDITO"
    | "TARJETA_DEBITO"
    | "OTRO";

export interface CuentaListItem {
    id: string;
    nombre: string;
    tipo: TipoCuentaValue;
    saldoInicial: string;
    saldoActual: string;
    activo: boolean;
    createdAt: Date;
    movimientosCount: number;
}

export interface CuentaPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
}