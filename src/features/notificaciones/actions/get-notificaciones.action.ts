"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { syncNotificacionesCuotas } from "@/features/notificaciones/helpers/sync-notificaciones.helper";
import type {
    NotificacionFilterValue,
    NotificacionListItem,
} from "@/features/notificaciones/types/notificacion.types";

interface GetNotificacionesParams {
    filter?: NotificacionFilterValue;
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

export async function getNotificacionesAction({
    filter = "TODAS",
}: GetNotificacionesParams = {}): Promise<NotificacionListItem[]> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    await syncNotificacionesCuotas(userId);

    const notificaciones = await prisma.notificacion.findMany({
        where: buildNotificacionWhere(userId, filter),
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

    return notificaciones.map((notificacion) => ({
        id: notificacion.id,
        titulo: notificacion.titulo,
        mensaje: notificacion.mensaje,
        tipo: notificacion.tipo,
        leida: notificacion.leida,
        createdAt: notificacion.createdAt,
        cuota: notificacion.cuota,
    }));
}