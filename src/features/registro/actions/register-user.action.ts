"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { hashPassword } from "@/lib/password";
import { registroSchema } from "@/features/registro/schemas";
import type { RegisterUserActionState } from "@/features/registro/types";

const DEFAULT_CATEGORIAS = [
    {
        nombre: "Sueldo",
        tipo: "INGRESO" as const,
        color: "#10b981",
        icono: "wallet",
    },
    {
        nombre: "Ventas",
        tipo: "INGRESO" as const,
        color: "#0ea5e9",
        icono: "trending-up",
    },
    {
        nombre: "Comida",
        tipo: "GASTO" as const,
        color: "#f97316",
        icono: "utensils",
    },
    {
        nombre: "Transporte",
        tipo: "GASTO" as const,
        color: "#6366f1",
        icono: "car",
    },
    {
        nombre: "Servicios",
        tipo: "GASTO" as const,
        color: "#ef4444",
        icono: "receipt",
    },
    {
        nombre: "Comunicación",
        tipo: "GASTO" as const,
        color: "#ec4899",
        icono: "phone",
    },
];

const DEFAULT_CUENTAS = [
    {
        nombre: "Efectivo",
        tipo: "EFECTIVO" as const,
        saldoInicial: 0,
    },
    {
        nombre: "Banco",
        tipo: "BANCO" as const,
        saldoInicial: 0,
    },
];

export async function registerUserAction(
    _prevState: RegisterUserActionState,
    formData: FormData
): Promise<RegisterUserActionState> {
    const parsed = registroSchema.safeParse({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });

    if (existingUser) {
        return {
            success: false,
            errors: {
                email: ["Ya existe un usuario registrado con este correo."],
            },
        };
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name,
                email,
                passwordHash,
                activo: true,
            },
            select: {
                id: true,
            },
        });

        await tx.configuracionNotificacion.create({
            data: {
                userId: user.id,
                avisarPorCorreo: true,
                diasAviso: [3, 2, 0],
            },
        });

        await tx.categoria.createMany({
            data: DEFAULT_CATEGORIAS.map((categoria) => ({
                userId: user.id,
                nombre: categoria.nombre,
                tipo: categoria.tipo,
                color: categoria.color,
                icono: categoria.icono,
                activo: true,
            })),
        });

        await tx.cuenta.createMany({
            data: DEFAULT_CUENTAS.map((cuenta) => ({
                userId: user.id,
                nombre: cuenta.nombre,
                tipo: cuenta.tipo,
                saldoInicial: cuenta.saldoInicial,
                activo: true,
            })),
        });
    });

    await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard",
    });

    return {
        success: true,
        message: "Usuario registrado correctamente.",
    };
}