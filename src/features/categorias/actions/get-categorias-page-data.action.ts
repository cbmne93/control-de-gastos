"use server";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";
import type {
    CategoriaListItem,
    CategoriaPagination,
} from "@/features/categorias/types/categoria.types";

const PAGE_SIZE = 10;

interface GetCategoriasPageDataParams {
    page?: number;
}

function normalizePage(page?: number) {
    if (!page || !Number.isInteger(page) || page < 1) {
        return 1;
    }

    return page;
}

export async function getCategoriasPageDataAction({
    page = 1,
}: GetCategoriasPageDataParams = {}): Promise<{
    categorias: CategoriaListItem[];
    pagination: CategoriaPagination;
}> {
    const userId = await getCurrentUserIdOrRedirect();

    const totalItems = await prisma.categoria.count({
        where: {
            userId,
        },
    });

    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const currentPage = Math.min(normalizePage(page), totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const categorias = await prisma.categoria.findMany({
        where: {
            userId,
        },
        skip,
        take: PAGE_SIZE,
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

    return {
        categorias: categorias.map((categoria) => ({
            id: categoria.id,
            nombre: categoria.nombre,
            tipo: categoria.tipo,
            color: categoria.color,
            icono: categoria.icono,
            activo: categoria.activo,
            createdAt: categoria.createdAt,
            movimientosCount: categoria._count.movimientos,
        })),
        pagination: {
            currentPage,
            totalPages,
            totalItems,
            pageSize: PAGE_SIZE,
        },
    };
}