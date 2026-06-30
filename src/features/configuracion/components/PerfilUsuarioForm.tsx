"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save, UserRound } from "lucide-react";

import { updateUserProfileAction } from "@/features/configuracion/actions";
import type { ConfiguracionActionState } from "@/features/configuracion/types";

interface PerfilUsuarioFormProps {
    name: string;
    email: string;
}

const initialState: ConfiguracionActionState = {
    success: false,
};

const inputClassName =
    "h-11 w-full rounded-xl border border-(--app-border) bg-(--app-card) pl-10 pr-3 text-sm font-medium text-foreground outline-none transition placeholder:text-slate-400 focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-(--app-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
            {pending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                </>
            ) : (
                <>
                    <Save className="h-4 w-4" />
                    Guardar cambios
                </>
            )}
        </button>
    );
}

function FieldError({ errors }: { errors?: string[] }) {
    if (!errors?.length) {
        return null;
    }

    return (
        <p className="mt-1.5 text-sm font-medium text-rose-600">
            {errors[0]}
        </p>
    );
}

export function PerfilUsuarioForm({ name, email }: PerfilUsuarioFormProps) {
    const [state, formAction] = useActionState(
        updateUserProfileAction,
        initialState,
    );

    const [dismissedMessageId, setDismissedMessageId] = useState<number | null>(
        null,
    );

    const showSuccessMessage = Boolean(
        state.success &&
        state.message &&
        state.timestamp &&
        dismissedMessageId !== state.timestamp,
    );

    useEffect(() => {
        if (!state.success || !state.message || !state.timestamp) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setDismissedMessageId(state.timestamp ?? null);
        }, 3500);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [state.success, state.message, state.timestamp]);

    return (
        <form action={formAction} className="space-y-5">
            {showSuccessMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {state.message}
                </div>
            ) : null}

            {state.errors?.general?.length ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {state.errors.general[0]}
                </div>
            ) : null}

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
                        defaultValue={name}
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

                <input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="h-11 w-full cursor-not-allowed rounded-xl border border-(--app-border) bg-(--app-card-soft) px-3 text-sm font-bold text-slate-700 outline-none"
                />

                <p className="mt-1.5 text-xs font-medium text-slate-500">
                    El correo se utiliza para iniciar sesión y por ahora no se
                    modifica desde esta pantalla.
                </p>
            </div>

            <SubmitButton />
        </form>
    );
}