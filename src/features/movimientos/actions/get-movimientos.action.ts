"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

type GetMovimientosParams = {
    query?: string;
    tipo?: "INGRESO" | "GASTO" | "TODOS";
};

export async function getMovimientosAction(params?: GetMovimientosParams) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return [];
    }

    const query = params?.query?.trim();
    const tipo = params?.tipo;

    const movimientos = await prisma.movimiento.findMany({
        where: {
            userId,
            ...(tipo && tipo !== "TODOS" ? { tipo } : {}),
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
        orderBy: [
            {
                fecha: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
        include: {
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
            _count: {
                select: {
                    cuotas: true,
                },
            },
        },
    });

    return movimientos.map((movimiento) => ({
        id: movimiento.id,
        tipo: movimiento.tipo,
        descripcion: movimiento.descripcion,
        monto: Number(movimiento.monto),
        fecha: movimiento.fecha,
        tieneCuotas: movimiento.tieneCuotas,
        cantidadCuotas: movimiento._count.cuotas,
        categoria: movimiento.categoria,
        cuenta: movimiento.cuenta,
    }));
}