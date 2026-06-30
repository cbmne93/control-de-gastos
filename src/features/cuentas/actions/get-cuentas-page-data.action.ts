"use server";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";
import type {
    CuentaListItem,
    CuentaPagination,
} from "@/features/cuentas/types/cuenta.types";

const PAGE_SIZE = 10;

interface GetCuentasPageDataParams {
    page?: number;
}

function normalizePage(page?: number) {
    if (!page || !Number.isInteger(page) || page < 1) {
        return 1;
    }

    return page;
}

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

export async function getCuentasPageDataAction({
    page = 1,
}: GetCuentasPageDataParams = {}): Promise<{
    cuentas: CuentaListItem[];
    pagination: CuentaPagination;
}> {
    const userId = await getCurrentUserIdOrRedirect();

    const totalItems = await prisma.cuenta.count({
        where: {
            userId,
        },
    });

    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const currentPage = Math.min(normalizePage(page), totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const cuentas = await prisma.cuenta.findMany({
        where: {
            userId,
        },
        skip,
        take: PAGE_SIZE,
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

    const cuentasConSaldo = await Promise.all(
        cuentas.map(async (cuenta) => {
            const saldoActual = await calcularSaldoActualCuenta(
                cuenta.id,
                userId,
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
        }),
    );

    return {
        cuentas: cuentasConSaldo,
        pagination: {
            currentPage,
            totalPages,
            totalItems,
            pageSize: PAGE_SIZE,
        },
    };
}