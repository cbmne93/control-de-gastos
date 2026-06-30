"use client";

import { useActionState } from "react";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { KeyRound, Loader2, LockKeyhole } from "lucide-react";

import { changePasswordAction } from "@/features/configuracion/actions";
import type { ConfiguracionActionState } from "@/features/configuracion/types";

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
                    Actualizando...
                </>
            ) : (
                <>
                    <KeyRound className="h-4 w-4" />
                    Cambiar contraseña
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

export function CambiarPasswordForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction] = useActionState(
        changePasswordAction,
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

        formRef.current?.reset();

        const timeout = window.setTimeout(() => {
            setDismissedMessageId(state.timestamp ?? null);
        }, 3500);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [state.success, state.message, state.timestamp]);

    return (
        <form ref={formRef} action={formAction} className="space-y-5">
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
                    htmlFor="currentPassword"
                    className="mb-1.5 block text-sm font-bold text-slate-700"
                >
                    Contraseña actual
                </label>

                <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        autoComplete="current-password"
                        className={inputClassName}
                    />
                </div>

                <FieldError errors={state.errors?.currentPassword} />
            </div>

            <div>
                <label
                    htmlFor="newPassword"
                    className="mb-1.5 block text-sm font-bold text-slate-700"
                >
                    Nueva contraseña
                </label>

                <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        className={inputClassName}
                    />
                </div>

                <FieldError errors={state.errors?.newPassword} />
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-bold text-slate-700"
                >
                    Confirmar nueva contraseña
                </label>

                <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        className={inputClassName}
                    />
                </div>

                <FieldError errors={state.errors?.confirmPassword} />
            </div>

            <SubmitButton />
        </form>
    );
}