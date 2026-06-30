"use server";

import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

function getTodayStart() {
    const today = new Date();

    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
    );
}

export async function getMovimientoCuotasDetailAction(movimientoId: string) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        notFound();
    }

    const todayStart = getTodayStart();

    await prisma.gastoCuota.updateMany({
        where: {
            estado: "PENDIENTE",
            fechaVencimiento: {
                lt: todayStart,
            },
            movimiento: {
                id: movimientoId,
                userId,
            },
        },
        data: {
            estado: "VENCIDA",
        },
    });

    const movimiento = await prisma.movimiento.findFirst({
        where: {
            id: movimientoId,
            userId,
            tipo: "GASTO",
            tieneCuotas: true,
        },
        include: {
            categoria: {
                select: {
                    nombre: true,
                },
            },
            cuenta: {
                select: {
                    nombre: true,
                },
            },
            cuotas: {
                orderBy: {
                    numeroCuota: "asc",
                },
                select: {
                    id: true,
                    numeroCuota: true,
                    totalCuotas: true,
                    monto: true,
                    fechaVencimiento: true,
                    fechaPago: true,
                    estado: true,
                },
            },
        },
    });

    if (!movimiento) {
        notFound();
    }

    const cuotas = movimiento.cuotas.map((cuota) => ({
        id: cuota.id,
        numeroCuota: cuota.numeroCuota,
        totalCuotas: cuota.totalCuotas,
        monto: Number(cuota.monto),
        fechaVencimiento: cuota.fechaVencimiento,
        fechaPago: cuota.fechaPago,
        estado: cuota.estado,
    }));

    const total = cuotas.reduce((acc, cuota) => acc + cuota.monto, 0);

    const pagado = cuotas
        .filter((cuota) => cuota.estado === "PAGADA")
        .reduce((acc, cuota) => acc + cuota.monto, 0);

    const pendiente = cuotas
        .filter(
            (cuota) =>
                cuota.estado === "PENDIENTE" || cuota.estado === "VENCIDA"
        )
        .reduce((acc, cuota) => acc + cuota.monto, 0);

    const cuotasPagadas = cuotas.filter(
        (cuota) => cuota.estado === "PAGADA"
    ).length;

    const cuotasPendientes = cuotas.filter(
        (cuota) => cuota.estado === "PENDIENTE"
    ).length;

    const cuotasVencidas = cuotas.filter(
        (cuota) => cuota.estado === "VENCIDA"
    ).length;

    return {
        id: movimiento.id,
        descripcion: movimiento.descripcion,
        fecha: movimiento.fecha,
        total,
        pagado,
        pendiente,
        cuotasPagadas,
        cuotasPendientes,
        cuotasVencidas,
        totalCuotas: cuotas.length,
        categoria: movimiento.categoria,
        cuenta: movimiento.cuenta,
        cuotas,
    };
}