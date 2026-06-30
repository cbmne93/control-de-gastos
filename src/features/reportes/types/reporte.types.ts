export interface ReportePeriodo {
    month: number;
    year: number;
}

export interface ReporteResumenItem {
    id: string;
    nombre: string;
    ingresos: number;
    gastos: number;
    balance: number;
}

export type ReporteDetalleTipo = "INGRESO" | "GASTO";

export type ReporteDetalleOrigen = "MOVIMIENTO" | "CUOTA";

export interface ReporteDetalleItem {
    id: string;
    fecha: Date;
    tipo: ReporteDetalleTipo;
    descripcion: string;
    categoria: string;
    cuenta: string;
    origen: ReporteDetalleOrigen;
    monto: number;
    cuota?: {
        numeroCuota: number;
        totalCuotas: number;
    };
}

export interface ReporteMensualData {
    periodo: ReportePeriodo;

    totalIngresos: number;
    totalGastosSinCuotas: number;
    totalCuotasPagadas: number;
    totalGastosPagados: number;
    totalCompromisosPendientes: number;
    balanceDisponible: number;

    cantidadIngresos: number;
    cantidadGastosSinCuotas: number;
    cantidadCuotasPagadas: number;
    cantidadCuotasPendientes: number;
    cantidadCuotasVencidas: number;

    categorias: ReporteResumenItem[];
    cuentas: ReporteResumenItem[];
    detalle: ReporteDetalleItem[];
}