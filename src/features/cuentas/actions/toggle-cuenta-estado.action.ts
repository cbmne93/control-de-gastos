"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";

export async function toggleCuentaEstadoAction(formData: FormData) {
    const userId = await getCurrentUserIdOrRedirect();

    const id = String(formData.get("id") ?? "");
    const activo = String(formData.get("activo") ?? "") === "true";

    if (!id) {
        return;
    }

    await prisma.cuenta.updateMany({
        where: {
            id,
            userId,
        },
        data: {
            activo: !activo,
        },
    });

    revalidatePath("/cuentas");
}