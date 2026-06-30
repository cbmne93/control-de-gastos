"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { syncNotificacionesCuotas } from "@/features/notificaciones/helpers/sync-notificaciones.helper";

function getTodayStart() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today;
}

function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
}

export async function marcarCuotaPendienteAction(id: string) {
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
            fechaVencimiento: true,
            movimientoId: true,
        },
    });

    if (!cuota) {
        return {
            success: false,
            message: "No se encontró la cuota.",
        };
    }

    if (cuota.estado !== "PAGADA") {
        return {
            success: false,
            message: "Solo se puede restaurar una cuota pagada.",
        };
    }

    const todayStart = getTodayStart();
    const sevenDaysFromToday = addDays(todayStart, 7);

    const nuevoEstado =
        cuota.fechaVencimiento < todayStart ? "VENCIDA" : "PENDIENTE";

    await prisma.gastoCuota.update({
        where: {
            id,
        },
        data: {
            estado: nuevoEstado,
            fechaPago: null,
        },
    });

    await syncNotificacionesCuotas(userId);

    if (nuevoEstado === "VENCIDA") {
        await prisma.notificacion.updateMany({
            where: {
                userId,
                cuotaId: id,
                tipo: "CUOTA_VENCIDA",
            },
            data: {
                leida: false,
            },
        });
    }

    if (
        nuevoEstado === "PENDIENTE" &&
        cuota.fechaVencimiento >= todayStart &&
        cuota.fechaVencimiento < sevenDaysFromToday
    ) {
        await prisma.notificacion.updateMany({
            where: {
                userId,
                cuotaId: id,
                tipo: "CUOTA_POR_VENCER",
            },
            data: {
                leida: false,
            },
        });
    }

    revalidatePath("/cuotas");
    revalidatePath(`/cuotas/${cuota.movimientoId}`);
    revalidatePath("/dashboard");
    revalidatePath("/cuentas");
    revalidatePath("/reportes");
    revalidatePath("/notificaciones");

    return {
        success: true,
        message:
            nuevoEstado === "VENCIDA"
                ? "La cuota fue restaurada como vencida."
                : "La cuota fue restaurada como pendiente.",
    };
}