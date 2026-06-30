"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
    Loader2,
    LockKeyhole,
    Mail,
    UserRound,
    UserRoundPlus,
} from "lucide-react";

import { registerUserAction } from "@/features/registro/actions";
import type { RegisterUserActionState } from "@/features/registro/types";

const initialState: RegisterUserActionState = {
    success: false,
};

const inputClassName =
    "h-12 w-full rounded-xl border border-(--app-border) bg-(--app-card) pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)";

interface FieldErrorProps {
    errors?: string[];
}

function FieldError({ errors }: FieldErrorProps) {
    if (!errors?.length) {
        return null;
    }

    return (
        <p className="mt-1.5 text-sm font-medium text-rose-600">
            {errors[0]}
        </p>
    );
}

export function RegistroForm() {
    const [state, formAction, isPending] = useActionState(
        registerUserAction,
        initialState,
    );

    return (
        <div className="w-full max-w-md rounded-3xl border border-(--app-border) bg-(--app-card) p-8 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--app-primary) text-white shadow-sm ring-1 ring-(--app-primary-muted)">
                <UserRoundPlus className="h-7 w-7" />
            </div>

            <div className="mt-5 text-center">
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                    Crear cuenta
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Completá tus datos para empezar a controlar tus gastos.
                </p>
            </div>

            {state.errors?.general?.length ? (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {state.errors.general[0]}
                </div>
            ) : null}

            <form action={formAction} className="mt-7 space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-bold text-slate-700"
                    >
                        Nombre
                    </label>

                    <div className="relative">
                        <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Ej: Administrador"
                            className={inputClassName}
                        />
                    </div>

                    <FieldError errors={state.errors?.name} />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-bold text-slate-700"
                    >
                        Correo electrónico
                    </label>

                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="usuario@correo.com"
                            className={inputClassName}
                        />
                    </div>

                    <FieldError errors={state.errors?.email} />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-1.5 block text-sm font-bold text-slate-700"
                    >
                        Contraseña
                    </label>

                    <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Mínimo 6 caracteres"
                            className={inputClassName}
                        />
                    </div>

                    <FieldError errors={state.errors?.password} />
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="mb-1.5 block text-sm font-bold text-slate-700"
                    >
                        Confirmar contraseña
                    </label>

                    <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Repetí la contraseña"
                            className={inputClassName}
                        />
                    </div>

                    <FieldError errors={state.errors?.confirmPassword} />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--app-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creando cuenta...
                        </>
                    ) : (
                        <>
                            <UserRoundPlus className="h-4 w-4" />
                            Crear cuenta
                        </>
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                ¿Ya tenés una cuenta?{" "}
                <Link
                    href="/login"
                    className="font-bold text-(--app-primary) transition hover:opacity-80"
                >
                    Iniciar sesión
                </Link>
            </p>
        </div>
    );
}