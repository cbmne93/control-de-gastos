"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

export async function marcarCuotaPagadaAction(id: string) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const cuota = await prisma.gastoCuota.findFirst({
        where: {
            id,
            movimiento: {
                userId,
            },
        },
        select: {
            id: true,
            estado: true,
            movimientoId: true,
        },
    });

    if (!cuota) {
        return {
            success: false,
            message: "No se encontró la cuota.",
        };
    }

    if (cuota.estado === "PAGADA") {
        return {
            success: false,
            message: "La cuota ya está marcada como pagada.",
        };
    }

    await prisma.$transaction([
        prisma.gastoCuota.update({
            where: {
                id,
            },
            data: {
                estado: "PAGADA",
                fechaPago: new Date(),
            },
        }),

        prisma.notificacion.updateMany({
            where: {
                userId,
                cuotaId: id,
                leida: false,
            },
            data: {
                leida: true,
            },
        }),
    ]);

    revalidatePath("/cuotas");
    revalidatePath(`/cuotas/${cuota.movimientoId}`);
    revalidatePath("/dashboard");
    revalidatePath("/cuentas");
    revalidatePath("/reportes");
    revalidatePath("/notificaciones");

    return {
        success: true,
        message: "Cuota marcada como pagada.",
    };
}