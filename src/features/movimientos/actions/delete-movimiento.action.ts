"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

type DeleteMovimientoResult = {
    success: boolean;
    message: string;
};

export async function deleteMovimientoAction(
    id: string
): Promise<DeleteMovimientoResult> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return {
            success: false,
            message: "No se pudo identificar al usuario.",
        };
    }

    const movimiento = await prisma.movimiento.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            _count: {
                select: {
                    cuotas: true,
                },
            },
        },
    });

    if (!movimiento) {
        return {
            success: false,
            message: "No se encontró el movimiento.",
        };
    }

    if (movimiento._count.cuotas > 0) {
        return {
            success: false,
            message:
                "No se puede eliminar un movimiento que ya tiene cuotas relacionadas.",
        };
    }

    await prisma.movimiento.delete({
        where: {
            id,
        },
    });

    revalidatePath("/movimientos");
    revalidatePath("/dashboard");

    return {
        success: true,
        message: "Movimiento eliminado correctamente.",
    };
}