import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { prisma } from "@/lib/prisma-client";
import { verifyPassword } from "@/lib/password";

const loginSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
    },

    providers: [
        Credentials({
            name: "Credenciales",
            credentials: {
                email: {
                    label: "Correo electrónico",
                    type: "email",
                },
                password: {
                    label: "Contraseña",
                    type: "password",
                },
            },

            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials);

                if (!parsed.success) {
                    return null;
                }

                const { email, password } = parsed.data;

                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });

                if (!user || !user.activo) {
                    return null;
                }

                const passwordValida = await verifyPassword(
                    password,
                    user.passwordHash,
                );

                if (!passwordValida) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }

            return session;
        },
    },
});