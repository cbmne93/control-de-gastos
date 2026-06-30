"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

interface NotificacionDuplicable {
    id: string;
    cuotaId: string | null;
    tipo: string;
    titulo: string;
    leida: boolean;
}

function getDuplicateKey(notificacion: NotificacionDuplicable) {
    return [
        notificacion.cuotaId,
        notificacion.tipo,
        notificacion.titulo.trim().toLowerCase(),
    ].join("::");
}

export async function limpiarNotificacionesDuplicadasAction() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const notificaciones = await prisma.notificacion.findMany({
        where: {
            userId,
            cuotaId: {
                not: null,
            },
        },
        select: {
            id: true,
            cuotaId: true,
            tipo: true,
            titulo: true,
            leida: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const groups = new Map<string, NotificacionDuplicable[]>();

    for (const notificacion of notificaciones) {
        const key = getDuplicateKey(notificacion);
        const currentGroup = groups.get(key) ?? [];

        currentGroup.push(notificacion);
        groups.set(key, currentGroup);
    }

    const duplicateGroups = Array.from(groups.values()).filter(
        (group) => group.length > 1,
    );

    if (duplicateGroups.length === 0) {
        return {
            success: true,
            message: "No se encontraron notificaciones duplicadas.",
        };
    }

    const idsToDelete = duplicateGroups.flatMap((group) =>
        group.slice(1).map((notificacion) => notificacion.id),
    );

    const idsToKeepAsUnread = duplicateGroups
        .filter((group) => {
            const [first] = group;
            const hasUnread = group.some((notificacion) => !notificacion.leida);

            return first.leida && hasUnread;
        })
        .map((group) => group[0].id);

    await prisma.$transaction(async (tx) => {
        if (idsToKeepAsUnread.length > 0) {
            await tx.notificacion.updateMany({
                where: {
                    userId,
                    id: {
                        in: idsToKeepAsUnread,
                    },
                },
                data: {
                    leida: false,
                },
            });
        }

        await tx.notificacion.deleteMany({
            where: {
                userId,
                id: {
                    in: idsToDelete,
                },
            },
        });
    });

    revalidatePath("/notificaciones");
    revalidatePath("/dashboard");

    return {
        success: true,
        message:
            idsToDelete.length === 1
                ? "Se eliminó 1 notificación duplicada."
                : `Se eliminaron ${idsToDelete.length} notificaciones duplicadas.`,
    };
}