"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";

export async function toggleCategoriaEstadoAction(formData: FormData) {
    const userId = await getCurrentUserIdOrRedirect();

    const id = String(formData.get("id") ?? "");
    const activo = String(formData.get("activo") ?? "") === "true";

    if (!id) {
        return;
    }

    await prisma.categoria.update({
        where: {
            id,
            userId,
        },
        data: {
            activo: !activo,
        },
    });

    revalidatePath("/categorias");
}