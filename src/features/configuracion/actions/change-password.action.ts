"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { hashPassword, verifyPassword } from "@/lib/password";
import { changePasswordSchema } from "@/features/configuracion/schemas";
import type { ConfiguracionActionState } from "@/features/configuracion/types";

export async function changePasswordAction(
    _prevState: ConfiguracionActionState,
    formData: FormData
): Promise<ConfiguracionActionState> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const parsed = changePasswordSchema.safeParse({
        currentPassword: String(formData.get("currentPassword") ?? ""),
        newPassword: String(formData.get("newPassword") ?? ""),
        confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            passwordHash: true,
        },
    });

    if (!user) {
        return {
            success: false,
            errors: {
                general: ["No se encontró el usuario actual."],
            },
        };
    }

    const passwordValida = await verifyPassword(
        parsed.data.currentPassword,
        user.passwordHash
    );

    if (!passwordValida) {
        return {
            success: false,
            errors: {
                currentPassword: ["La contraseña actual no es correcta."],
            },
        };
    }

    const newPasswordHash = await hashPassword(parsed.data.newPassword);

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            passwordHash: newPasswordHash,
        },
    });

    return {
        success: true,
        message: "Contraseña actualizada correctamente.",
        timestamp: Date.now(),
    };
}