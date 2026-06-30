"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export type LoginActionState = {
    error?: string;
};

export async function loginAction(
    _prevState: LoginActionState,
    formData: FormData,
): Promise<LoginActionState> {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        return {
            error: "Ingresá tu correo electrónico y contraseña.",
        };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });

        return {};
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                error: "Correo o contraseña incorrectos.",
            };
        }

        throw error;
    }
}