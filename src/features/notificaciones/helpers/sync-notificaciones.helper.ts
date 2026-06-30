import { prisma } from "@/lib/prisma-client";

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

function formatFecha(date: Date) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

export async function syncNotificacionesCuotas(userId: string) {
    const todayStart = getTodayStart();
    const sevenDaysFromToday = addDays(todayStart, 7);

    await prisma.gastoCuota.updateMany({
        where: {
            estado: "PENDIENTE",
            fechaVencimiento: {
                lt: todayStart,
            },
            movimiento: {
                userId,
            },
        },
        data: {
            estado: "VENCIDA",
        },
    });

    const [cuotasVencidas, cuotasPorVencer] = await Promise.all([
        prisma.gastoCuota.findMany({
            where: {
                estado: "VENCIDA",
                movimiento: {
                    userId,
                },
            },
            select: {
                id: true,
                numeroCuota: true,
                totalCuotas: true,
                fechaVencimiento: true,
                movimiento: {
                    select: {
                        descripcion: true,
                    },
                },
            },
        }),

        prisma.gastoCuota.findMany({
            where: {
                estado: "PENDIENTE",
                fechaVencimiento: {
                    gte: todayStart,
                    lt: sevenDaysFromToday,
                },
                movimiento: {
                    userId,
                },
            },
            select: {
                id: true,
                numeroCuota: true,
                totalCuotas: true,
                fechaVencimiento: true,
                movimiento: {
                    select: {
                        descripcion: true,
                    },
                },
            },
        }),
    ]);

    const cuotaIds = [
        ...cuotasVencidas.map((cuota) => cuota.id),
        ...cuotasPorVencer.map((cuota) => cuota.id),
    ];

    if (cuotaIds.length === 0) {
        return;
    }

    const notificacionesExistentes = await prisma.notificacion.findMany({
        where: {
            userId,
            cuotaId: {
                in: cuotaIds,
            },
            tipo: {
                in: ["CUOTA_VENCIDA", "CUOTA_POR_VENCER"],
            },
        },
        select: {
            cuotaId: true,
            tipo: true,
        },
    });

    const existentesSet = new Set(
        notificacionesExistentes
            .filter((notificacion) => notificacion.cuotaId)
            .map(
                (notificacion) =>
                    `${notificacion.cuotaId}-${notificacion.tipo}`
            )
    );

    const nuevasNotificaciones = [
        ...cuotasVencidas
            .filter(
                (cuota) =>
                    !existentesSet.has(`${cuota.id}-CUOTA_VENCIDA`)
            )
            .map((cuota) => ({
                userId,
                cuotaId: cuota.id,
                tipo: "CUOTA_VENCIDA" as const,
                titulo: "Cuota vencida",
                mensaje: `La cuota ${cuota.numeroCuota} de ${cuota.totalCuotas
                    } de "${cuota.movimiento.descripcion}" venció el ${formatFecha(
                        cuota.fechaVencimiento
                    )}.`,
            })),

        ...cuotasPorVencer
            .filter(
                (cuota) =>
                    !existentesSet.has(`${cuota.id}-CUOTA_POR_VENCER`)
            )
            .map((cuota) => ({
                userId,
                cuotaId: cuota.id,
                tipo: "CUOTA_POR_VENCER" as const,
                titulo: "Cuota próxima a vencer",
                mensaje: `La cuota ${cuota.numeroCuota} de ${cuota.totalCuotas
                    } de "${cuota.movimiento.descripcion}" vence el ${formatFecha(
                        cuota.fechaVencimiento
                    )}.`,
            })),
    ];

    if (nuevasNotificaciones.length === 0) {
        return;
    }

    await prisma.notificacion.createMany({
        data: nuevasNotificaciones,
    });
}