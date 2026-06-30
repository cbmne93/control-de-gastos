import { prisma } from "@/lib/prisma-client";
import { getReporteMonthRange } from "@/features/reportes/helpers/reporte-date.helper";
import type {
    ReporteDetalleItem,
    ReporteMensualData,
    ReportePeriodo,
    ReporteResumenItem,
} from "@/features/reportes/types/reporte.types";

function getEmptyResumenItem(id: string, nombre: string): ReporteResumenItem {
    return {
        id,
        nombre,
        ingresos: 0,
        gastos: 0,
        balance: 0,
    };
}

function addIngresoToMap(
    map: Map<string, ReporteResumenItem>,
    id: string,
    nombre: string,
    monto: number
) {
    const current = map.get(id) ?? getEmptyResumenItem(id, nombre);

    current.ingresos += monto;
    current.balance = current.ingresos - current.gastos;

    map.set(id, current);
}

function addGastoToMap(
    map: Map<string, ReporteResumenItem>,
    id: string,
    nombre: string,
    monto: number
) {
    const current = map.get(id) ?? getEmptyResumenItem(id, nombre);

    current.gastos += monto;
    current.balance = current.ingresos - current.gastos;

    map.set(id, current);
}

function sortResumenItems(items: ReporteResumenItem[]) {
    return items.sort((a, b) => {
        const totalA = a.ingresos + a.gastos;
        const totalB = b.ingresos + b.gastos;

        return totalB - totalA;
    });
}

function sortDetalleItems(items: ReporteDetalleItem[]) {
    return items.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

export async function getReporteMensualData(
    userId: string,
    periodo: ReportePeriodo
): Promise<ReporteMensualData> {
    const { startOfMonth, startOfNextMonth } = getReporteMonthRange(periodo);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    await prisma.gastoCuota.updateMany({
        where: {
            estado: "PENDIENTE",
            fechaVencimiento: {
                lt: todayStart,
            },
            movimiento: {
                userId,
            },
        },
        data: {
            estado: "VENCIDA",
        },
    });

    const [
        movimientosDelMes,
        cuotasPagadasDelMes,
        compromisosPendientes,
        cantidadCuotasPendientes,
        cantidadCuotasVencidas,
    ] = await Promise.all([
        prisma.movimiento.findMany({
            where: {
                userId,
                fecha: {
                    gte: startOfMonth,
                    lt: startOfNextMonth,
                },
            },
            select: {
                id: true,
                tipo: true,
                descripcion: true,
                monto: true,
                fecha: true,
                tieneCuotas: true,
                categoria: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                cuenta: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
        }),

        prisma.gastoCuota.findMany({
            where: {
                estado: "PAGADA",
                fechaPago: {
                    gte: startOfMonth,
                    lt: startOfNextMonth,
                },
                movimiento: {
                    userId,
                },
            },
            select: {
                id: true,
                numeroCuota: true,
                totalCuotas: true,
                monto: true,
                fechaPago: true,
                fechaVencimiento: true,
                movimiento: {
                    select: {
                        descripcion: true,
                        categoria: {
                            select: {
                                id: true,
                                nombre: true,
                            },
                        },
                        cuenta: {
                            select: {
                                id: true,
                                nombre: true,
                            },
                        },
                    },
                },
            },
        }),

        prisma.gastoCuota.aggregate({
            where: {
                estado: {
                    in: ["PENDIENTE", "VENCIDA"],
                },
                movimiento: {
                    userId,
                },
            },
            _sum: {
                monto: true,
            },
        }),

        prisma.gastoCuota.count({
            where: {
                estado: "PENDIENTE",
                movimiento: {
                    userId,
                },
            },
        }),

        prisma.gastoCuota.count({
            where: {
                estado: "VENCIDA",
                movimiento: {
                    userId,
                },
            },
        }),
    ]);

    const categoriasMap = new Map<string, ReporteResumenItem>();
    const cuentasMap = new Map<string, ReporteResumenItem>();
    const detalle: ReporteDetalleItem[] = [];

    let totalIngresos = 0;
    let totalGastosSinCuotas = 0;
    let cantidadIngresos = 0;
    let cantidadGastosSinCuotas = 0;

    for (const movimiento of movimientosDelMes) {
        const monto = Number(movimiento.monto);

        if (movimiento.tipo === "INGRESO") {
            totalIngresos += monto;
            cantidadIngresos += 1;

            addIngresoToMap(
                categoriasMap,
                movimiento.categoria.id,
                movimiento.categoria.nombre,
                monto
            );

            addIngresoToMap(
                cuentasMap,
                movimiento.cuenta.id,
                movimiento.cuenta.nombre,
                monto
            );

            detalle.push({
                id: movimiento.id,
                fecha: movimiento.fecha,
                tipo: "INGRESO",
                descripcion: movimiento.descripcion,
                categoria: movimiento.categoria.nombre,
                cuenta: movimiento.cuenta.nombre,
                origen: "MOVIMIENTO",
                monto,
            });
        }

        if (movimiento.tipo === "GASTO" && !movimiento.tieneCuotas) {
            totalGastosSinCuotas += monto;
            cantidadGastosSinCuotas += 1;

            addGastoToMap(
                categoriasMap,
                movimiento.categoria.id,
                movimiento.categoria.nombre,
                monto
            );

            addGastoToMap(
                cuentasMap,
                movimiento.cuenta.id,
                movimiento.cuenta.nombre,
                monto
            );

            detalle.push({
                id: movimiento.id,
                fecha: movimiento.fecha,
                tipo: "GASTO",
                descripcion: movimiento.descripcion,
                categoria: movimiento.categoria.nombre,
                cuenta: movimiento.cuenta.nombre,
                origen: "MOVIMIENTO",
                monto,
            });
        }
    }

    let totalCuotasPagadas = 0;

    for (const cuota of cuotasPagadasDelMes) {
        const monto = Number(cuota.monto);

        totalCuotasPagadas += monto;

        addGastoToMap(
            categoriasMap,
            cuota.movimiento.categoria.id,
            cuota.movimiento.categoria.nombre,
            monto
        );

        addGastoToMap(
            cuentasMap,
            cuota.movimiento.cuenta.id,
            cuota.movimiento.cuenta.nombre,
            monto
        );

        detalle.push({
            id: cuota.id,
            fecha: cuota.fechaPago ?? cuota.fechaVencimiento,
            tipo: "GASTO",
            descripcion: cuota.movimiento.descripcion,
            categoria: cuota.movimiento.categoria.nombre,
            cuenta: cuota.movimiento.cuenta.nombre,
            origen: "CUOTA",
            monto,
            cuota: {
                numeroCuota: cuota.numeroCuota,
                totalCuotas: cuota.totalCuotas,
            },
        });
    }

    const totalGastosPagados = totalGastosSinCuotas + totalCuotasPagadas;
    const balanceDisponible = totalIngresos - totalGastosPagados;
    const totalCompromisosPendientes = Number(
        compromisosPendientes._sum.monto ?? 0
    );

    return {
        periodo,

        totalIngresos,
        totalGastosSinCuotas,
        totalCuotasPagadas,
        totalGastosPagados,
        totalCompromisosPendientes,
        balanceDisponible,

        cantidadIngresos,
        cantidadGastosSinCuotas,
        cantidadCuotasPagadas: cuotasPagadasDelMes.length,
        cantidadCuotasPendientes,
        cantidadCuotasVencidas,

        categorias: sortResumenItems(Array.from(categoriasMap.values())),
        cuentas: sortResumenItems(Array.from(cuentasMap.values())),
        detalle: sortDetalleItems(detalle),
    };
}