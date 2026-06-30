"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, LockKeyhole, LogIn, Mail, WalletCards } from "lucide-react";

import { loginAction, type LoginActionState } from "../actions/login.action";

const initialState: LoginActionState = {
    error: undefined,
};

const inputClassName =
    "h-12 w-full rounded-xl border border-(--app-border) bg-(--app-card) pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--app-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
            {pending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ingresando...
                </>
            ) : (
                <>
                    <LogIn className="h-4 w-4" />
                    Ingresar
                </>
            )}
        </button>
    );
}

export function LoginForm() {
    const [state, formAction] = useActionState(loginAction, initialState);

    return (
        <div className="w-full max-w-md rounded-3xl border border-(--app-border) bg-(--app-card) p-8 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--app-primary) text-white shadow-sm ring-1 ring-(--app-primary-muted)">
                <WalletCards className="h-7 w-7" />
            </div>

            <div className="mt-5 text-center">
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                    Control de gastos
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Ingresá para ver tus gastos, cuotas y vencimientos.
                </p>
            </div>

            <form action={formAction} className="mt-7 space-y-5">
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
                            placeholder="admin@controlgastos.com"
                            autoComplete="email"
                            className={inputClassName}
                        />
                    </div>
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
                            placeholder="Ingresá tu contraseña"
                            autoComplete="current-password"
                            className={inputClassName}
                        />
                    </div>
                </div>

                {state.error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                        {state.error}
                    </div>
                ) : null}

                <SubmitButton />
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                ¿No tenés una cuenta?{" "}
                <Link
                    href="/registro"
                    className="font-bold text-(--app-primary) transition hover:opacity-80"
                >
                    Crear cuenta
                </Link>
            </p>
        </div>
    );
}