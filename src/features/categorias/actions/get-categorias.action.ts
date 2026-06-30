"use server";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";
import { type CategoriaListItem } from "../types/categoria.types";

export async function getCategoriasAction(): Promise<CategoriaListItem[]> {
    const userId = await getCurrentUserIdOrRedirect();

    const categorias = await prisma.categoria.findMany({
        where: {
            userId,
        },
        include: {
            _count: {
                select: {
                    movimientos: true,
                },
            },
        },
        orderBy: [
            {
                activo: "desc",
            },
            {
                tipo: "asc",
            },
            {
                nombre: "asc",
            },
        ],
    });

    return categorias.map((categoria) => ({
        id: categoria.id,
        nombre: categoria.nombre,
        tipo: categoria.tipo,
        color: categoria.color,
        icono: categoria.icono,
        activo: categoria.activo,
        createdAt: categoria.createdAt,
        movimientosCount: categoria._count.movimientos,
    }));
}

export async function getCategoriaByIdAction(
    id?: string,
): Promise<CategoriaListItem | null> {
    if (!id) {
        return null;
    }

    const userId = await getCurrentUserIdOrRedirect();

    const categoria = await prisma.categoria.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            _count: {
                select: {
                    movimientos: true,
                },
            },
        },
    });

    if (!categoria) {
        return null;
    }

    return {
        id: categoria.id,
        nombre: categoria.nombre,
        tipo: categoria.tipo,
        color: categoria.color,
        icono: categoria.icono,
        activo: categoria.activo,
        createdAt: categoria.createdAt,
        movimientosCount: categoria._count.movimientos,
    };
}