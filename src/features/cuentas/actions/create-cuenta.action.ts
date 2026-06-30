"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";
import { cuentaSchema } from "../schemas/cuenta.schema";

export type CuentaActionState = {
    success?: boolean;
    message?: string;
    errors?: {
        nombre?: string[];
        tipo?: string[];
        saldoInicial?: string[];
    };
};

export async function createCuentaAction(
    _prevState: CuentaActionState,
    formData: FormData,
): Promise<CuentaActionState> {
    const userId = await getCurrentUserIdOrRedirect();

    const parsed = cuentaSchema.safeParse({
        nombre: formData.get("nombre"),
        tipo: formData.get("tipo"),
        saldoInicial: formData.get("saldoInicial"),
    });

    if (!parsed.success) {
        return {
            errors: parsed.error.flatten().fieldErrors,
            message: "Revisá los datos ingresados.",
        };
    }

    try {
        await prisma.cuenta.create({
            data: {
                userId,
                nombre: parsed.data.nombre,
                tipo: parsed.data.tipo,
                saldoInicial: parsed.data.saldoInicial,
            },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return {
                message: "Ya existe una cuenta con ese nombre.",
            };
        }

        return {
            message: "No se pudo crear la cuenta.",
        };
    }

    revalidatePath("/cuentas");
    redirect("/cuentas?success=cuenta-creada");
}