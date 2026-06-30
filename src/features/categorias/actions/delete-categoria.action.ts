"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";

export async function deleteCategoriaAction(formData: FormData) {
    const userId = await getCurrentUserIdOrRedirect();

    const id = String(formData.get("id") ?? "");

    if (!id) {
        return;
    }

    const movimientosCount = await prisma.movimiento.count({
        where: {
            userId,
            categoriaId: id,
        },
    });

    if (movimientosCount > 0) {
        return;
    }

    await prisma.categoria.delete({
        where: {
            id,
            userId,
        },
    });

    revalidatePath("/categorias");
}