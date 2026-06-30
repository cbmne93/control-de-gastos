"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

type EstadoCuotaFilter = "TODOS" | "PENDIENTE" | "PAGADA" | "VENCIDA";

type GetMovimientosConCuotasParams = {
    query?: string;
    estado?: EstadoCuotaFilter;
};

function getTodayStart() {
    const today = new Date();

    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
    );
}

export async function getMovimientosConCuotasAction(
    params?: GetMovimientosConCuotasParams
) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return [];
    }

    const todayStart = getTodayStart();
    const query = params?.query?.trim();
    const estado = params?.estado ?? "TODOS";

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

    const movimientos = await prisma.movimiento.findMany({
        where: {
            userId,
            tipo: "GASTO",
            tieneCuotas: true,
            cuotas: {
                some: estado !== "TODOS" ? { estado } : {},
            },
            ...(query
                ? {
                    OR: [
                        {
                            descripcion: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                        {
                            categoria: {
                                nombre: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                        },
                        {
                            cuenta: {
                                nombre: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                }
                : {}),
        },
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
            cuotas: {
                orderBy: {
                    numeroCuota: "asc",
                },
                select: {
                    id: true,
                    numeroCuota: true,
                    totalCuotas: true,
                    monto: true,
                    fechaVencimiento: true,
                    fechaPago: true,
                    estado: true,
                },
            },
        },
        orderBy: [
            {
                fecha: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });

    return movimientos
        .map((movimiento) => {
            const cuotas = movimiento.cuotas.map((cuota) => ({
                id: cuota.id,
                numeroCuota: cuota.numeroCuota,
                totalCuotas: cuota.totalCuotas,
                monto: Number(cuota.monto),
                fechaVencimiento: cuota.fechaVencimiento,
                fechaPago: cuota.fechaPago,
                estado: cuota.estado,
            }));

            const total = cuotas.reduce((acc, cuota) => acc + cuota.monto, 0);

            const pagado = cuotas
                .filter((cuota) => cuota.estado === "PAGADA")
                .reduce((acc, cuota) => acc + cuota.monto, 0);

            const pendiente = cuotas
                .filter(
                    (cuota) =>
                        cuota.estado === "PENDIENTE" ||
                        cuota.estado === "VENCIDA"
                )
                .reduce((acc, cuota) => acc + cuota.monto, 0);

            const cuotasPagadas = cuotas.filter(
                (cuota) => cuota.estado === "PAGADA"
            ).length;

            const cuotasPendientes = cuotas.filter(
                (cuota) => cuota.estado === "PENDIENTE"
            ).length;

            const cuotasVencidas = cuotas.filter(
                (cuota) => cuota.estado === "VENCIDA"
            ).length;

            const proximaCuota =
                cuotas
                    .filter((cuota) => cuota.estado !== "PAGADA")
                    .sort(
                        (a, b) =>
                            a.fechaVencimiento.getTime() -
                            b.fechaVencimiento.getTime()
                    )[0] ?? null;

            return {
                id: movimiento.id,
                descripcion: movimiento.descripcion,
                fecha: movimiento.fecha,
                total,
                pagado,
                pendiente,
                cuotasPagadas,
                cuotasPendientes,
                cuotasVencidas,
                totalCuotas: cuotas.length,
                proximaCuota,
                categoria: movimiento.categoria,
                cuenta: movimiento.cuenta,
            };
        })
        .sort((a, b) => {
            if (!a.proximaCuota && !b.proximaCuota) {
                return b.fecha.getTime() - a.fecha.getTime();
            }

            if (!a.proximaCuota) {
                return 1;
            }

            if (!b.proximaCuota) {
                return -1;
            }

            return (
                a.proximaCuota.fechaVencimiento.getTime() -
                b.proximaCuota.fechaVencimiento.getTime()
            );
        });
}