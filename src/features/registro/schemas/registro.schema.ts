import { z } from "zod";

export const registroSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "El nombre debe tener al menos 2 caracteres")
            .max(80, "El nombre no puede superar 80 caracteres"),

        email: z
            .string()
            .trim()
            .email("Ingresá un correo electrónico válido")
            .transform((email) => email.toLowerCase()),

        password: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres")
            .max(72, "La contraseña no puede superar 72 caracteres"),

        confirmPassword: z
            .string()
            .min(1, "Debés confirmar la contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

export type RegistroFormValues = z.infer<typeof registroSchema>;