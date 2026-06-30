"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";
import { cuentaSchema } from "../schemas/cuenta.schema";
import { type CuentaActionState } from "./create-cuenta.action";

export async function updateCuentaAction(
    _prevState: CuentaActionState,
    formData: FormData,
): Promise<CuentaActionState> {
    const userId = await getCurrentUserIdOrRedirect();

    const parsed = cuentaSchema.safeParse({
        id: formData.get("id"),
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

    if (!parsed.data.id) {
        return {
            message: "No se encontró la cuenta a editar.",
        };
    }

    try {
        await prisma.cuenta.updateMany({
            where: {
                id: parsed.data.id,
                userId,
            },
            data: {
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
            message: "No se pudo actualizar la cuenta.",
        };
    }

    revalidatePath("/cuentas");
    redirect("/cuentas?success=cuenta-actualizada");
}