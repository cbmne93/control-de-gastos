"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

type EstadoCuotaFilter = "TODOS" | "PENDIENTE" | "PAGADA" | "VENCIDA";

type GetCuotasParams = {
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

export async function getCuotasAction(params?: GetCuotasParams) {
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

    const cuotas = await prisma.gastoCuota.findMany({
        where: {
            movimiento: {
                userId,
            },
            ...(estado !== "TODOS" ? { estado } : {}),
            ...(query
                ? {
                    OR: [
                        {
                            movimiento: {
                                descripcion: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                        },
                        {
                            movimiento: {
                                categoria: {
                                    nombre: {
                                        contains: query,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                        {
                            movimiento: {
                                cuenta: {
                                    nombre: {
                                        contains: query,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    ],
                }
                : {}),
        },
        orderBy: [
            {
                fechaVencimiento: "asc",
            },
            {
                numeroCuota: "asc",
            },
        ],
        include: {
            movimiento: {
                select: {
                    id: true,
                    descripcion: true,
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
            },
        },
    });

    return cuotas.map((cuota) => ({
        id: cuota.id,
        numeroCuota: cuota.numeroCuota,
        totalCuotas: cuota.totalCuotas,
        monto: Number(cuota.monto),
        fechaVencimiento: cuota.fechaVencimiento,
        fechaPago: cuota.fechaPago,
        estado: cuota.estado,
        movimiento: cuota.movimiento,
    }));
}