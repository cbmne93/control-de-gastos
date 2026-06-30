export type EstadoCuotaValue = "PENDIENTE" | "PAGADA" | "VENCIDA";

export type EstadoCuotaFilter = "TODOS" | EstadoCuotaValue;

export interface CuotaListItem {
    id: string;
    numeroCuota: number;
    totalCuotas: number;
    monto: number;
    fechaVencimiento: Date;
    fechaPago: Date | null;
    estado: EstadoCuotaValue;
    movimiento: {
        id: string;
        descripcion: string;
        categoria: {
            nombre: string;
        };
        cuenta: {
            nombre: string;
        };
    };
}

export interface MovimientoCuotaResumenItem {
    id: string;
    numeroCuota: number;
    totalCuotas: number;
    monto: number;
    fechaVencimiento: Date;
    fechaPago: Date | null;
    estado: EstadoCuotaValue;
}

export interface MovimientoConCuotasItem {
    id: string;
    descripcion: string;
    fecha: Date;
    total: number;
    pagado: number;
    pendiente: number;
    cuotasPagadas: number;
    cuotasPendientes: number;
    cuotasVencidas: number;
    totalCuotas: number;
    proximaCuota: MovimientoCuotaResumenItem | null;
    categoria: {
        nombre: string;
    };
    cuenta: {
        nombre: string;
    };
}



export interface CuotaDetalleItem {
    id: string;
    numeroCuota: number;
    totalCuotas: number;
    monto: number;
    fechaVencimiento: Date;
    fechaPago: Date | null;
    estado: EstadoCuotaValue;
}

export interface MovimientoCuotasDetalleItem {
    id: string;
    descripcion: string;
    fecha: Date;
    total: number;
    pagado: number;
    pendiente: number;
    cuotasPagadas: number;
    cuotasPendientes: number;
    cuotasVencidas: number;
    totalCuotas: number;
    categoria: {
        nombre: string;
    };
    cuenta: {
        nombre: string;
    };
    cuotas: CuotaDetalleItem[];
}