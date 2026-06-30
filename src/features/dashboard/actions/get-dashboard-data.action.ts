"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import {
    addDays,
    getMonthRange,
    getTodayStart,
} from "@/features/dashboard/helpers/dashboard-date.helper";
import { syncNotificacionesCuotas } from "@/features/notificaciones/helpers/sync-notificaciones.helper";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";

export async function getDashboardDataAction(): Promise<DashboardData> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const { startOfMonth, startOfNextMonth } = getMonthRange();
    const todayStart = getTodayStart();
    const sevenDaysFromToday = addDays(todayStart, 7);

    await syncNotificacionesCuotas(userId);

    const [
        ingresosMes,
        gastosSinCuotasMes,
        cuotasPagadasMesMonto,
        compromisosPendientesMonto,
        movimientosMes,
        cuotasPendientes,
        notificacionesPendientes,
        cuotasVencidas,
        cuotasPorVencer,
        cuotasPagadasMes,
        proximosVencimientos,
        ultimosRegistros,
    ] = await Promise.all([
        prisma.movimiento.aggregate({
            where: {
                userId,
                tipo: "INGRESO",
                fecha: {
                    gte: startOfMonth,
                    lt: startOfNextMonth,
                },
            },
            _sum: {
                monto: true,
            },
        }),

        prisma.movimiento.aggregate({
            where: {
                userId,
                tipo: "GASTO",
                tieneCuotas: false,
                fecha: {
                    gte: startOfMonth,
                    lt: startOfNextMonth,
                },
            },
            _sum: {
                monto: true,
            },
        }),

        prisma.gastoCuota.aggregate({
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
            _sum: {
                monto: true,
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

        prisma.movimiento.count({
            where: {
                userId,
                fecha: {
                    gte: startOfMonth,
                    lt: startOfNextMonth,
                },
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

        prisma.notificacion.count({
            where: {
                userId,
                leida: false,
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

        prisma.gastoCuota.count({
            where: {
                estado: "PENDIENTE",
                fechaVencimiento: {
                    gte: todayStart,
                    lt: sevenDaysFromToday,
                },
                movimiento: {
                    userId,
                },
            },
        }),

        prisma.gastoCuota.count({
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
        }),

        prisma.gastoCuota.findMany({
            where: {
                estado: "PENDIENTE",
                fechaVencimiento: {
                    gte: todayStart,
                    lt: sevenDaysFromToday,
                },
                movimiento: {
                    userId,
                },
            },
            orderBy: {
                fechaVencimiento: "asc",
            },
            take: 5,
            include: {
                movimiento: {
                    select: {
                        descripcion: true,
                    },
                },
            },
        }),

        prisma.movimiento.findMany({
            where: {
                userId,
            },
            orderBy: [
                {
                    fecha: "desc",
                },
                {
                    createdAt: "desc",
                },
            ],
            take: 5,
            include: {
                categoria: {
                    select: {
                        nombre: true,
                    },
                },
                cuenta: {
                    select: {
                        nombre: true,
                    },
                },
            },
        }),
    ]);

    const totalIngresosMes = Number(ingresosMes._sum.monto ?? 0);
    const totalGastosSinCuotasMes = Number(gastosSinCuotasMes._sum.monto ?? 0);
    const totalCuotasPagadasMes = Number(cuotasPagadasMesMonto._sum.monto ?? 0);

    const totalGastosPagadosMes =
        totalGastosSinCuotasMes + totalCuotasPagadasMes;

    const totalCompromisosPendientes = Number(
        compromisosPendientesMonto._sum.monto ?? 0
    );

    const balanceDisponibleMes = totalIngresosMes - totalGastosPagadosMes;

    return {
        totalIngresosMes,
        totalGastosSinCuotasMes,
        totalCuotasPagadasMes,
        totalGastosPagadosMes,
        totalCompromisosPendientes,
        balanceDisponibleMes,

        movimientosMes,
        cuotasPendientes,
        cuotasVencidas,
        cuotasPorVencer,
        cuotasPagadasMes,
        notificacionesPendientes,

        proximosVencimientos: proximosVencimientos.map((cuota) => ({
            id: cuota.id,
            numeroCuota: cuota.numeroCuota,
            totalCuotas: cuota.totalCuotas,
            monto: Number(cuota.monto),
            fechaVencimiento: cuota.fechaVencimiento,
            movimiento: cuota.movimiento,
        })),

        ultimosRegistros: ultimosRegistros.map((movimiento) => ({
            id: movimiento.id,
            tipo: movimiento.tipo,
            descripcion: movimiento.descripcion,
            monto: Number(movimiento.monto),
            fecha: movimiento.fecha,
            tieneCuotas: movimiento.tieneCuotas,
            categoria: movimiento.categoria,
            cuenta: movimiento.cuenta,
        })),
    };
}