"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { updatePerfilSchema } from "@/features/configuracion/schemas";
import type { ConfiguracionActionState } from "@/features/configuracion/types";

export async function updateUserProfileAction(
    _prevState: ConfiguracionActionState,
    formData: FormData
): Promise<ConfiguracionActionState> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const parsed = updatePerfilSchema.safeParse({
        name: String(formData.get("name") ?? ""),
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name: parsed.data.name,
        },
    });

    revalidatePath("/configuracion");
    revalidatePath("/dashboard");

    return {
        success: true,
        message: "Datos del perfil actualizados correctamente.",
        timestamp: Date.now(),
    };
}