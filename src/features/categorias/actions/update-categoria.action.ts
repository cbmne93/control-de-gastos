"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma-client";
import { getCurrentUserIdOrRedirect } from "@/lib/auth-utils";
import { categoriaSchema } from "../schemas/categoria.schema";
import { type CategoriaActionState } from "./create-categoria.action";

export async function updateCategoriaAction(
    _prevState: CategoriaActionState,
    formData: FormData,
): Promise<CategoriaActionState> {
    const userId = await getCurrentUserIdOrRedirect();

    const parsed = categoriaSchema.safeParse({
        id: formData.get("id"),
        nombre: formData.get("nombre"),
        tipo: formData.get("tipo"),
        color: formData.get("color") || undefined,
        icono: formData.get("icono") || undefined,
    });

    if (!parsed.success) {
        return {
            errors: parsed.error.flatten().fieldErrors,
            message: "Revisá los datos ingresados.",
        };
    }

    if (!parsed.data.id) {
        return {
            message: "No se encontró la categoría a editar.",
        };
    }

    try {
        await prisma.categoria.update({
            where: {
                id: parsed.data.id,
                userId,
            },
            data: {
                nombre: parsed.data.nombre,
                tipo: parsed.data.tipo,
                color: parsed.data.color || null,
                icono: parsed.data.icono || null,
            },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return {
                message: "Ya existe una categoría con ese nombre y tipo.",
            };
        }

        return {
            message: "No se pudo actualizar la categoría.",
        };
    }

    revalidatePath("/categorias");
    redirect("/categorias?success=categoria-actualizada");
}