"use server";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";
import { type CuentaListItem } from "../types/cuenta.types";

async function calcularSaldoActualCuenta(cuentaId: string, userId: string) {
    const [cuenta, ingresos, gastosSinCuotas, cuotasPagadas] =
        await Promise.all([
            prisma.cuenta.findFirst({
                where: {
                    id: cuentaId,
                    userId,
                },
                select: {
                    saldoInicial: true,
                },
            }),

            prisma.movimiento.aggregate({
                where: {
                    userId,
                    cuentaId,
                    tipo: "INGRESO",
                },
                _sum: {
                    monto: true,
                },
            }),

            prisma.movimiento.aggregate({
                where: {
                    userId,
                    cuentaId,
                    tipo: "GASTO",
                    tieneCuotas: false,
                },
                _sum: {
                    monto: true,
                },
            }),

            prisma.gastoCuota.aggregate({
                where: {
                    estado: "PAGADA",
                    movimiento: {
                        userId,
                        cuentaId,
                    },
                },
                _sum: {
                    monto: true,
                },
            }),
        ]);

    const saldoInicial = Number(cuenta?.saldoInicial ?? 0);
    const totalIngresos = Number(ingresos._sum.monto ?? 0);
    const totalGastosSinCuotas = Number(gastosSinCuotas._sum.monto ?? 0);
    const totalCuotasPagadas = Number(cuotasPagadas._sum.monto ?? 0);

    return (
        saldoInicial +
        totalIngresos -
        totalGastosSinCuotas -
        totalCuotasPagadas
    );
}

export async function getCuentasAction(): Promise<CuentaListItem[]> {
    const userId = await getCurrentUserIdOrRedirect();

    const cuentas = await prisma.cuenta.findMany({
        where: {
            userId,
        },
        include: {
            _count: {
                select: {
                    movimientos: true,
                },
            },
        },
        orderBy: [
            {
                activo: "desc",
            },
            {
                nombre: "asc",
            },
        ],
    });

    return Promise.all(
        cuentas.map(async (cuenta) => {
            const saldoActual = await calcularSaldoActualCuenta(
                cuenta.id,
                userId
            );

            return {
                id: cuenta.id,
                nombre: cuenta.nombre,
                tipo: cuenta.tipo,
                saldoInicial: cuenta.saldoInicial.toString(),
                saldoActual: saldoActual.toString(),
                activo: cuenta.activo,
                createdAt: cuenta.createdAt,
                movimientosCount: cuenta._count.movimientos,
            };
        })
    );
}

export async function getCuentaByIdAction(
    id?: string
): Promise<CuentaListItem | null> {
    if (!id) {
        return null;
    }

    const userId = await getCurrentUserIdOrRedirect();

    const cuenta = await prisma.cuenta.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            _count: {
                select: {
                    movimientos: true,
                },
            },
        },
    });

    if (!cuenta) {
        return null;
    }

    const saldoActual = await calcularSaldoActualCuenta(cuenta.id, userId);

    return {
        id: cuenta.id,
        nombre: cuenta.nombre,
        tipo: cuenta.tipo,
        saldoInicial: cuenta.saldoInicial.toString(),
        saldoActual: saldoActual.toString(),
        activo: cuenta.activo,
        createdAt: cuenta.createdAt,
        movimientosCount: cuenta._count.movimientos,
    };
}