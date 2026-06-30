"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";

interface UpdateConfiguracionNotificacionesState {
    success?: string;
    error?: string;
    fieldErrors?: {
        diasAvisoTexto?: string;
    };
}

function parseDiasAviso(value: FormDataEntryValue | null) {
    const texto = String(value ?? "").trim();

    if (!texto) {
        throw new Error("Indicá al menos un día de aviso.");
    }

    const dias = texto
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => Number(item));

    if (dias.length === 0) {
        throw new Error("Indicá al menos un día de aviso.");
    }

    const tieneValorInvalido = dias.some(
        (dia) => !Number.isInteger(dia) || dia < 0 || dia > 30,
    );

    if (tieneValorInvalido) {
        throw new Error(
            "Los días de aviso deben ser números enteros entre 0 y 30.",
        );
    }

    return Array.from(new Set(dias)).sort((a, b) => b - a);
}

export async function updateConfiguracionNotificacionesAction(
    _prevState: UpdateConfiguracionNotificacionesState,
    formData: FormData,
): Promise<UpdateConfiguracionNotificacionesState> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return {
            error: "Tu sesión expiró. Volvé a iniciar sesión.",
        };
    }

    let diasAviso: number[];

    try {
        diasAviso = parseDiasAviso(formData.get("diasAvisoTexto"));
    } catch (error) {
        return {
            fieldErrors: {
                diasAvisoTexto:
                    error instanceof Error
                        ? error.message
                        : "Los días de aviso no son válidos.",
            },
        };
    }

    const avisarPorCorreo = formData.get("avisarPorCorreo") === "on";

    try {
        await prisma.configuracionNotificacion.upsert({
            where: {
                userId,
            },
            create: {
                userId,
                avisarPorCorreo,
                diasAviso,
            },
            update: {
                avisarPorCorreo,
                diasAviso,
            },
        });

        revalidatePath("/configuracion");

        return {
            success: "Configuración de notificaciones actualizada correctamente.",
        };
    } catch {
        return {
            error: "No se pudo guardar la configuración de notificaciones.",
        };
    }
}