import { z } from "zod";

export const updatePerfilSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(80, "El nombre no puede superar 80 caracteres"),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Ingresá tu contraseña actual"),

        newPassword: z
            .string()
            .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
            .max(72, "La nueva contraseña no puede superar 72 caracteres"),

        confirmPassword: z
            .string()
            .min(1, "Confirmá la nueva contraseña"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });