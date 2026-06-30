"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { BellRing, Info, Loader2, Mail, Save } from "lucide-react";

import { updateConfiguracionNotificacionesAction } from "../actions/update-configuracion-notificaciones.action";

interface ConfiguracionNotificacionesFormProps {
    avisarPorCorreo: boolean;
    diasAviso: number[];
}

const initialState = {
    success: undefined,
    error: undefined,
    fieldErrors: undefined,
};

const inputClassName =
    "h-11 w-full rounded-xl border border-(--app-border) bg-(--app-card) px-3 text-sm font-medium text-foreground outline-none transition placeholder:text-slate-400 focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)";

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
                    Guardar configuración
                </>
            )}
        </button>
    );
}

export function ConfiguracionNotificacionesForm({
    avisarPorCorreo,
    diasAviso,
}: ConfiguracionNotificacionesFormProps) {
    const [state, formAction] = useActionState(
        updateConfiguracionNotificacionesAction,
        initialState,
    );

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const diasAvisoTexto =
        diasAviso.length > 0 ? diasAviso.join(", ") : "2, 1, 0";

    useEffect(() => {
        if (!state.success) {
            return;
        }

        const showTimeout = window.setTimeout(() => {
            setShowSuccessMessage(true);
        }, 0);

        const hideTimeout = window.setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3500);

        return () => {
            window.clearTimeout(showTimeout);
            window.clearTimeout(hideTimeout);
        };
    }, [state]);

    return (
        <form action={formAction} className="space-y-5">
            {showSuccessMessage && state.success ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {state.success}
                </div>
            ) : null}

            {state.error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {state.error}
                </div>
            ) : null}

            <div className="rounded-2xl border border-(--app-border) bg-(--app-card-soft) p-4">
                <label className="flex cursor-pointer items-start gap-3">
                    <input
                        type="checkbox"
                        name="avisarPorCorreo"
                        defaultChecked={avisarPorCorreo}
                        className="mt-1 h-4 w-4 rounded border-(--app-border) accent-(--app-primary)"
                    />

                    <span className="space-y-1">
                        <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Mail className="h-4 w-4 text-(--app-primary)" />
                            Avisar por correo
                        </span>

                        <span className="block text-sm leading-6 text-slate-600">
                            Cuando esté activado, el sistema también enviará un
                            correo por cada aviso de cuota. Las notificaciones
                            internas se seguirán generando igualmente.
                        </span>
                    </span>
                </label>
            </div>

            <div>
                <label
                    htmlFor="diasAvisoTexto"
                    className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700"
                >
                    <BellRing className="h-4 w-4 text-(--app-primary)" />
                    Días de aviso
                </label>

                <input
                    id="diasAvisoTexto"
                    name="diasAvisoTexto"
                    type="text"
                    defaultValue={diasAvisoTexto}
                    placeholder="2, 1, 0"
                    className={inputClassName}
                />

                <div className="mt-2 flex gap-2 rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3 text-xs font-medium leading-5 text-slate-600">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-(--app-primary)" />

                    <p>
                        Separá los días con coma. Por ejemplo:{" "}
                        <strong className="font-bold text-slate-700">
                            2, 1, 0
                        </strong>{" "}
                        significa avisar 2 días antes, 1 día antes y el mismo
                        día del vencimiento.
                    </p>
                </div>

                {state.fieldErrors?.diasAvisoTexto ? (
                    <p className="mt-1.5 text-sm font-medium text-rose-600">
                        {state.fieldErrors.diasAvisoTexto}
                    </p>
                ) : null}
            </div>

            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    );
}