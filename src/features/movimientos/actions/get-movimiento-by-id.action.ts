"use server";

import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

export async function getMovimientoByIdAction(id: string) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        notFound();
    }

    const movimiento = await prisma.movimiento.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            categoria: {
                select: {
                    id: true,
                    nombre: true,
                    tipo: true,
                },
            },
            cuenta: {
                select: {
                    id: true,
                    nombre: true,
                    tipo: true,
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

    const primeraCuota = movimiento.cuotas[0];

    return {
        id: movimiento.id,
        tipo: movimiento.tipo,
        descripcion: movimiento.descripcion,
        monto: Number(movimiento.monto),
        fecha: movimiento.fecha,
        categoriaId: movimiento.categoriaId,
        cuentaId: movimiento.cuentaId,
        tieneCuotas: movimiento.tieneCuotas,
        cantidadCuotas: movimiento.cuotas.length,
        fechaPrimerVencimiento: primeraCuota?.fechaVencimiento ?? null,
        categoria: movimiento.categoria,
        cuenta: movimiento.cuenta,
        cuotas: movimiento.cuotas.map((cuota) => ({
            id: cuota.id,
            numeroCuota: cuota.numeroCuota,
            totalCuotas: cuota.totalCuotas,
            monto: Number(cuota.monto),
            fechaVencimiento: cuota.fechaVencimiento,
            fechaPago: cuota.fechaPago,
            estado: cuota.estado,
        })),
    };
}