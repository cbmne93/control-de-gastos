export type TipoMovimientoValue = "INGRESO" | "GASTO";

export type TipoCuentaValue =
    | "EFECTIVO"
    | "BANCO"
    | "BILLETERA"
    | "TARJETA_CREDITO"
    | "TARJETA_DEBITO"
    | "OTRO";

export interface MovimientoCategoriaOption {
    id: string;
    nombre: string;
    tipo: TipoMovimientoValue;
}

export interface MovimientoCuentaOption {
    id: string;
    nombre: string;
    tipo: TipoCuentaValue;
}

export interface MovimientoFormDefaultValues {
    tipo: TipoMovimientoValue;
    descripcion: string;
    monto: string;
    fecha: string;
    categoriaId: string;
    cuentaId: string;
    tieneCuotas: boolean;
    cantidadCuotas?: string;
    fechaPrimerVencimiento?: string;
}

export type MovimientoActionState = {
    success: boolean;
    message?: string;
    errors?: Partial<
        Record<
            | "tipo"
            | "descripcion"
            | "monto"
            | "fecha"
            | "categoriaId"
            | "cuentaId"
            | "tieneCuotas"
            | "cantidadCuotas"
            | "fechaPrimerVencimiento"
            | "general",
            string[]
        >
    >;
};

export type MovimientoTipoFilter = "TODOS" | TipoMovimientoValue;

export interface MovimientoListItem {
    id: string;
    tipo: TipoMovimientoValue;
    descripcion: string;
    monto: number;
    fecha: Date;
    tieneCuotas: boolean;
    cantidadCuotas: number;
    categoria: {
        id: string;
        nombre: string;
    };
    cuenta: {
        id: string;
        nombre: string;
    };
}

export interface MovimientoPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
}