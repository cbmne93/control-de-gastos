"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { parseDateInputAsDateOnly } from "@/lib/date/date-only";
import {
    movimientoSchema,
    type MovimientoSchema,
} from "@/features/movimientos/schemas/movimiento.schema";
import {
    generarFechasVencimiento,
    generarMontosCuotas,
} from "@/features/movimientos/helpers/movimiento-cuotas.helper";
import { parseMontoToNumber } from "@/features/movimientos/helpers/movimiento-format.helper";

type MovimientoActionState = {
    success: boolean;
    message?: string;
    errors?: Partial<Record<keyof MovimientoSchema | "general", string[]>>;
};

export async function updateMovimientoAction(
    id: string,
    _prevState: MovimientoActionState,
    formData: FormData
): Promise<MovimientoActionState> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return {
            success: false,
            errors: {
                general: ["No se pudo identificar al usuario."],
            },
        };
    }

    const movimientoActual = await prisma.movimiento.findFirst({
        where: {
            id,
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!movimientoActual) {
        return {
            success: false,
            errors: {
                general: ["No se encontró el movimiento."],
            },
        };
    }

    const rawData = {
        tipo: formData.get("tipo"),
        descripcion: formData.get("descripcion"),
        monto: formData.get("monto"),
        fecha: formData.get("fecha"),
        categoriaId: formData.get("categoriaId"),
        cuentaId: formData.get("cuentaId"),
        tieneCuotas: formData.get("tieneCuotas") === "on",
        cantidadCuotas: formData.get("cantidadCuotas"),
        fechaPrimerVencimiento: formData.get("fechaPrimerVencimiento"),
    };

    const result = movimientoSchema.safeParse(rawData);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
        };
    }

    const data = result.data;

    const [categoria, cuenta] = await Promise.all([
        prisma.categoria.findFirst({
            where: {
                id: data.categoriaId,
                userId,
                activo: true,
                tipo: data.tipo,
            },
            select: {
                id: true,
            },
        }),
        prisma.cuenta.findFirst({
            where: {
                id: data.cuentaId,
                userId,
                activo: true,
            },
            select: {
                id: true,
            },
        }),
    ]);

    if (!categoria) {
        return {
            success: false,
            errors: {
                categoriaId: [
                    "La categoría seleccionada no existe, está inactiva o no corresponde al tipo de movimiento.",
                ],
            },
        };
    }

    if (!cuenta) {
        return {
            success: false,
            errors: {
                cuentaId: ["La cuenta seleccionada no existe o está inactiva."],
            },
        };
    }

    const monto = parseMontoToNumber(data.monto);
    const tieneCuotas = data.tipo === "GASTO" && data.tieneCuotas;

    if (tieneCuotas && !data.cantidadCuotas) {
        return {
            success: false,
            errors: {
                cantidadCuotas: [
                    "La cantidad de cuotas es obligatoria cuando el gasto tiene cuotas.",
                ],
            },
        };
    }

    if (tieneCuotas && !data.fechaPrimerVencimiento) {
        return {
            success: false,
            errors: {
                fechaPrimerVencimiento: [
                    "La fecha del primer vencimiento es obligatoria cuando el gasto tiene cuotas.",
                ],
            },
        };
    }

    const cantidadCuotasSegura = tieneCuotas ? Number(data.cantidadCuotas) : 0;
    const fechaPrimerVencimientoSegura = tieneCuotas
        ? parseDateInputAsDateOnly(data.fechaPrimerVencimiento!)
        : null;

    await prisma.$transaction(async (tx) => {
        await tx.movimiento.update({
            where: {
                id,
            },
            data: {
                tipo: data.tipo,
                descripcion: data.descripcion,
                monto,
                fecha: parseDateInputAsDateOnly(data.fecha),
                categoriaId: data.categoriaId,
                cuentaId: data.cuentaId,
                tieneCuotas,
            },
        });

        await tx.gastoCuota.deleteMany({
            where: {
                movimientoId: id,
            },
        });

        if (!tieneCuotas || !fechaPrimerVencimientoSegura) {
            return;
        }

        const montos = generarMontosCuotas(monto, cantidadCuotasSegura);
        const fechas = generarFechasVencimiento(
            fechaPrimerVencimientoSegura,
            cantidadCuotasSegura
        );

        await tx.gastoCuota.createMany({
            data: montos.map((montoCuota, index) => ({
                movimientoId: id,
                numeroCuota: index + 1,
                totalCuotas: cantidadCuotasSegura,
                monto: montoCuota,
                fechaVencimiento: fechas[index],
                estado: "PENDIENTE",
            })),
        });
    });

    revalidatePath("/movimientos");
    revalidatePath("/dashboard");
    revalidatePath("/cuotas");

    redirect("/movimientos?updated=1");
}