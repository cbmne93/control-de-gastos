"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

export async function deleteNotificacionAction(id: string) {
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
        },
    });

    if (!notificacion) {
        return {
            success: false,
            message: "No se encontró la notificación.",
        };
    }

    await prisma.notificacion.delete({
        where: {
            id,
        },
    });

    revalidatePath("/notificaciones");
    revalidatePath("/dashboard");

    return {
        success: true,
        message: "Notificación eliminada.",
    };
}