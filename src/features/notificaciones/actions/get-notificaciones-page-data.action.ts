"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { syncNotificacionesCuotas } from "@/features/notificaciones/helpers/sync-notificaciones.helper";
import type {
    NotificacionFilterValue,
    NotificacionListItem,
    NotificacionesPagination,
    NotificacionesStats,
} from "@/features/notificaciones/types/notificacion.types";

const PAGE_SIZE = 10;

interface GetNotificacionesPageDataParams {
    filter?: NotificacionFilterValue;
    page?: number;
}

function normalizePage(page?: number) {
    if (!page || !Number.isInteger(page) || page < 1) {
        return 1;
    }

    return page;
}

function buildNotificacionWhere(userId: string, filter: NotificacionFilterValue) {
    if (filter === "SIN_LEER") {
        return {
            userId,
            leida: false,
        };
    }

    if (filter === "LEIDAS") {
        return {
            userId,
            leida: true,
        };
    }

    if (filter === "CUOTA_VENCIDA") {
        return {
            userId,
            tipo: "CUOTA_VENCIDA" as const,
        };
    }

    if (filter === "CUOTA_POR_VENCER") {
        return {
            userId,
            tipo: "CUOTA_POR_VENCER" as const,
        };
    }

    return {
        userId,
    };
}

export async function getNotificacionesPageDataAction({
    filter = "TODAS",
    page = 1,
}: GetNotificacionesPageDataParams = {}): Promise<{
    notificaciones: NotificacionListItem[];
    stats: NotificacionesStats;
    pagination: NotificacionesPagination;
}> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    await syncNotificacionesCuotas(userId);

    const where = buildNotificacionWhere(userId, filter);

    const [
        totalItems,
        todas,
        sinLeer,
        leidas,
        cuotaVencida,
        cuotaPorVencer,
    ] = await Promise.all([
        prisma.notificacion.count({
            where,
        }),

        prisma.notificacion.count({
            where: {
                userId,
            },
        }),

        prisma.notificacion.count({
            where: {
                userId,
                leida: false,
            },
        }),

        prisma.notificacion.count({
            where: {
                userId,
                leida: true,
            },
        }),

        prisma.notificacion.count({
            where: {
                userId,
                tipo: "CUOTA_VENCIDA",
            },
        }),

        prisma.notificacion.count({
            where: {
                userId,
                tipo: "CUOTA_POR_VENCER",
            },
        }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const currentPage = Math.min(normalizePage(page), totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const notificaciones = await prisma.notificacion.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy: [
            {
                leida: "asc",
            },
            {
                createdAt: "desc",
            },
        ],
        include: {
            cuota: {
                select: {
                    id: true,
                    numeroCuota: true,
                    totalCuotas: true,
                    fechaVencimiento: true,
                    movimiento: {
                        select: {
                            id: true,
                            descripcion: true,
                        },
                    },
                },
            },
        },
    });

    return {
        notificaciones: notificaciones.map((notificacion) => ({
            id: notificacion.id,
            titulo: notificacion.titulo,
            mensaje: notificacion.mensaje,
            tipo: notificacion.tipo,
            leida: notificacion.leida,
            createdAt: notificacion.createdAt,
            cuota: notificacion.cuota,
        })),
        stats: {
            todas,
            sinLeer,
            leidas,
            cuotaVencida,
            cuotaPorVencer,
        },
        pagination: {
            currentPage,
            totalPages,
            totalItems,
            pageSize: PAGE_SIZE,
        },
    };
}