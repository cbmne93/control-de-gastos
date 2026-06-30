export interface DashboardVencimientoItem {
    id: string;
    numeroCuota: number;
    totalCuotas: number;
    monto: number;
    fechaVencimiento: Date;
    movimiento: {
        descripcion: string;
    };
}

export interface DashboardUltimoRegistroItem {
    id: string;
    tipo: "INGRESO" | "GASTO";
    descripcion: string;
    monto: number;
    fecha: Date;
    tieneCuotas: boolean;
    categoria: {
        nombre: string;
    };
    cuenta: {
        nombre: string;
    };
}

export interface DashboardData {
    totalIngresosMes: number;
    totalGastosSinCuotasMes: number;
    totalCuotasPagadasMes: number;
    totalGastosPagadosMes: number;
    totalCompromisosPendientes: number;
    balanceDisponibleMes: number;

    movimientosMes: number;
    cuotasPendientes: number;
    cuotasVencidas: number;
    cuotasPorVencer: number;
    cuotasPagadasMes: number;
    notificacionesPendientes: number;

    proximosVencimientos: DashboardVencimientoItem[];
    ultimosRegistros: DashboardUltimoRegistroItem[];
}