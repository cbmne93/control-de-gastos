"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";

export async function deleteCuentaAction(formData: FormData) {
    const userId = await getCurrentUserIdOrRedirect();

    const id = String(formData.get("id") ?? "");

    if (!id) {
        return;
    }

    const movimientosCount = await prisma.movimiento.count({
        where: {
            userId,
            cuentaId: id,
        },
    });

    if (movimientosCount > 0) {
        return;
    }

    await prisma.cuenta.deleteMany({
        where: {
            id,
            userId,
        },
    });

    revalidatePath("/cuentas");
}