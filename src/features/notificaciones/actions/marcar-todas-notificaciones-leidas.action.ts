"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import type { NotificacionFilterValue } from "@/features/notificaciones/types/notificacion.types";

interface MarcarTodasParams {
    filter?: NotificacionFilterValue;
}

function buildUnreadWhere(userId: string, filter: NotificacionFilterValue) {
    if (filter === "CUOTA_VENCIDA") {
        return {
            userId,
            leida: false,
            tipo: "CUOTA_VENCIDA" as const,
        };
    }

    if (filter === "CUOTA_POR_VENCER") {
        return {
            userId,
            leida: false,
            tipo: "CUOTA_POR_VENCER" as const,
        };
    }

    if (filter === "LEIDAS") {
        return {
            userId,
            leida: false,
            id: "__NO_MATCH__",
        };
    }

    return {
        userId,
        leida: false,
    };
}

export async function marcarTodasNotificacionesLeidasAction({
    filter = "TODAS",
}: MarcarTodasParams = {}) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const result = await prisma.notificacion.updateMany({
        where: buildUnreadWhere(userId, filter),
        data: {
            leida: true,
        },
    });

    revalidatePath("/notificaciones");
    revalidatePath("/dashboard");

    return {
        success: true,
        message:
            result.count === 0
                ? "No había notificaciones pendientes para marcar."
                : "Las notificaciones fueron marcadas como leídas.",
    };
}