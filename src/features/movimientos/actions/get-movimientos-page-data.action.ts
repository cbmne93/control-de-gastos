"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import type {
    MovimientoListItem,
    MovimientoPagination,
    MovimientoTipoFilter,
} from "@/features/movimientos/types/movimiento.types";

const PAGE_SIZE = 10;

interface GetMovimientosPageDataParams {
    query?: string;
    tipo?: MovimientoTipoFilter;
    page?: number;
}

function normalizePage(page?: number) {
    if (!page || !Number.isInteger(page) || page < 1) {
        return 1;
    }

    return page;
}

function buildMovimientoWhere(params: {
    userId: string;
    query?: string;
    tipo?: MovimientoTipoFilter;
}) {
    const query = params.query?.trim();
    const tipo = params.tipo ?? "TODOS";

    return {
        userId: params.userId,
        ...(tipo !== "TODOS" ? { tipo } : {}),
        ...(query
            ? {
                OR: [
                    {
                        descripcion: {
                            contains: query,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        categoria: {
                            nombre: {
                                contains: query,
                                mode: "insensitive" as const,
                            },
                        },
                    },
                    {
                        cuenta: {
                            nombre: {
                                contains: query,
                                mode: "insensitive" as const,
                            },
                        },
                    },
                ],
            }
            : {}),
    };
}

export async function getMovimientosPageDataAction({
    query = "",
    tipo = "TODOS",
    page = 1,
}: GetMovimientosPageDataParams = {}): Promise<{
    movimientos: MovimientoListItem[];
    pagination: MovimientoPagination;
}> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const where = buildMovimientoWhere({
        userId,
        query,
        tipo,
    });

    const totalItems = await prisma.movimiento.count({
        where,
    });

    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const currentPage = Math.min(normalizePage(page), totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const movimientos = await prisma.movimiento.findMany({
        where,
        skip,
        take: PAGE_SIZE,
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

    return {
        movimientos: movimientos.map((movimiento) => ({
            id: movimiento.id,
            tipo: movimiento.tipo,
            descripcion: movimiento.descripcion,
            monto: Number(movimiento.monto),
            fecha: movimiento.fecha,
            tieneCuotas: movimiento.tieneCuotas,
            cantidadCuotas: movimiento._count.cuotas,
            categoria: movimiento.categoria,
            cuenta: movimiento.cuenta,
        })),
        pagination: {
            currentPage,
            totalPages,
            totalItems,
            pageSize: PAGE_SIZE,
        },
    };
}