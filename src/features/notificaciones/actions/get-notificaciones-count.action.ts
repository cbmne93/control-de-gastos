"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { syncNotificacionesCuotas } from "@/features/notificaciones/helpers/sync-notificaciones.helper";

export async function getNotificacionesNoLeidasCountAction() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    await syncNotificacionesCuotas(userId);

    return prisma.notificacion.count({
        where: {
            userId,
            leida: false,
        },
    });
}