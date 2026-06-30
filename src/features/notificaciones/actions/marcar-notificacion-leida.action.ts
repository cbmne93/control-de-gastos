"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

export async function marcarNotificacionLeidaAction(id: string) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const notificacion = await prisma.notificacion.findFirst({
        where: {
            id,
            userId,
        },
        select: {
            id: true,
            leida: true,
        },
    });

    if (!notificacion) {
        return {
            success: false,
            message: "No se encontró la notificación.",
        };
    }

    if (notificacion.leida) {
        return {
            success: true,
            message: "La notificación ya estaba marcada como leída.",
        };
    }

    await prisma.notificacion.update({
        where: {
            id,
        },
        data: {
            leida: true,
        },
    });

    revalidatePath("/notificaciones");
    revalidatePath("/dashboard");

    return {
        success: true,
        message: "Notificación marcada como leída.",
    };
}