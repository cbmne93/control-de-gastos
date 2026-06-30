"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

type TipoMovimientoValue = "INGRESO" | "GASTO";

export async function getMovimientoFormOptions(tipo?: TipoMovimientoValue) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return {
            categorias: [],
            cuentas: [],
        };
    }

    const [categorias, cuentas] = await Promise.all([
        prisma.categoria.findMany({
            where: {
                userId,
                activo: true,
                ...(tipo ? { tipo } : {}),
            },
            orderBy: {
                nombre: "asc",
            },
            select: {
                id: true,
                nombre: true,
                tipo: true,
            },
        }),
        prisma.cuenta.findMany({
            where: {
                userId,
                activo: true,
            },
            orderBy: {
                nombre: "asc",
            },
            select: {
                id: true,
                nombre: true,
                tipo: true,
            },
        }),
    ]);

    return {
        categorias,
        cuentas,
    };
}