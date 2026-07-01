"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MonitorCog, Palette } from "lucide-react";

import {
    updateAparienciaAction,
    type UpdateAparienciaState,
} from "@/features/configuracion/actions";

interface AparienciaFormProps {
    temaPreferido: "CLARO" | "OSCURO" | "SISTEMA";
    colorPrincipal: "TEAL" | "SKY" | "INDIGO" | "EMERALD";
}

type TemaPreferido = AparienciaFormProps["temaPreferido"];
type ColorPrincipal = AparienciaFormProps["colorPrincipal"];

const initialState: UpdateAparienciaState = {
    ok: false,
    message: "",
};

const temas: {
    value: TemaPreferido;
    label: string;
    helper: string;
}[] = [
        {
            value: "CLARO",
            label: "Claro",
            helper: "Diseño limpio y formal tipo aplicación financiera.",
        },
        {
            value: "OSCURO",
            label: "Oscuro",
            helper: "Ideal para usar de noche o en ambientes con poca luz.",
        },
        {
            value: "SISTEMA",
            label: "Sistema",
            helper: "Usa automáticamente la preferencia del dispositivo.",
        },
    ];

const colores: {
    value: ColorPrincipal;
    label: string;
    helper: string;
    swatchClassName: string;
    selectedClassName: string;
}[] = [
        {
            value: "TEAL",
            label: "Teal",
            helper: "Sobrio, moderno y financiero.",
            swatchClassName: "bg-teal-700",
            selectedClassName: "border-teal-600 bg-teal-50",
        },
        {
            value: "SKY",
            label: "Sky",
            helper: "Más claro, limpio y amigable.",
            swatchClassName: "bg-sky-700",
            selectedClassName: "border-sky-600 bg-sky-50",
        },
        {
            value: "INDIGO",
            label: "Indigo",
            helper: "Formal, elegante y corporativo.",
            swatchClassName: "bg-indigo-700",
            selectedClassName: "border-indigo-600 bg-indigo-50",
        },
        {
            value: "EMERALD",
            label: "Emerald",
            helper: "Profesional, fresco y financiero.",
            swatchClassName: "bg-emerald-700",
            selectedClassName: "border-emerald-600 bg-emerald-50",
        },
    ];

type VisibleMessage = {
    ok: boolean;
    message: string;
};

export function AparienciaForm({
    temaPreferido,
    colorPrincipal,
}: AparienciaFormProps) {
    const router = useRouter();

    const [temaSeleccionado, setTemaSeleccionado] =
        useState<TemaPreferido>(temaPreferido);

    const [colorSeleccionado, setColorSeleccionado] =
        useState<ColorPrincipal>(colorPrincipal);

    const [visibleMessage, setVisibleMessage] =
        useState<VisibleMessage | null>(null);

    const [state, formAction, isPending] = useActionState(
        updateAparienciaAction,
        initialState,
    );

    useEffect(() => {
        if (state.ok) {
            document.body.dataset.theme = temaSeleccionado;
            document.body.dataset.accent = colorSeleccionado;
            router.refresh();
        }
    }, [state.ok, temaSeleccionado, colorSeleccionado, router]);

    useEffect(() => {
        if (!state.message) {
            return;
        }

        const showTimeout = window.setTimeout(() => {
            setVisibleMessage({
                ok: state.ok,
                message: state.message,
            });
        }, 0);

        const hideTimeout = window.setTimeout(() => {
            setVisibleMessage(null);
        }, 3500);

        return () => {
            window.clearTimeout(showTimeout);
            window.clearTimeout(hideTimeout);
        };
    }, [state.ok, state.message]);

    return (
        <form action={formAction} className="space-y-5">
            <input
                type="hidden"
                name="temaPreferido"
                value={temaSeleccionado}
            />

            <input
                type="hidden"
                name="colorPrincipal"
                value={colorSeleccionado}
            />

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <MonitorCog className="h-4 w-4 text-(--app-primary)" />

                    <h3 className="text-sm font-bold text-foreground">
                        Tema del sistema
                    </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    {temas.map((tema) => {
                        const isSelected = temaSeleccionado === tema.value;

                        return (
                            <button
                                key={tema.value}
                                type="button"
                                onClick={() =>
                                    setTemaSeleccionado(tema.value)
                                }
                                className={`rounded-2xl border p-4 text-left transition hover:border-(--app-primary-muted) ${isSelected
                                        ? "border-(--app-primary) bg-(--app-primary-soft)"
                                        : "border-(--app-border) bg-(--app-card-soft)"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-bold text-foreground">
                                        {tema.label}
                                    </p>

                                    <span
                                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${isSelected
                                                ? "border-(--app-primary) bg-(--app-primary) text-white"
                                                : "border-slate-300 bg-white"
                                            }`}
                                    >
                                        {isSelected ? (
                                            <Check className="h-3 w-3" />
                                        ) : null}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs font-medium text-slate-600">
                                    {tema.helper}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {state.errors?.temaPreferido ? (
                    <p className="text-xs font-semibold text-red-600">
                        {state.errors.temaPreferido[0]}
                    </p>
                ) : null}
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-(--app-primary)" />

                    <h3 className="text-sm font-bold text-foreground">
                        Color principal
                    </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {colores.map((color) => {
                        const isSelected =
                            colorSeleccionado === color.value;

                        return (
                            <button
                                key={color.value}
                                type="button"
                                onClick={() =>
                                    setColorSeleccionado(color.value)
                                }
                                className={`rounded-2xl border p-4 text-left transition hover:border-(--app-primary-muted) ${isSelected
                                        ? color.selectedClassName
                                        : "border-(--app-border) bg-(--app-card-soft)"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">
                                            {color.label}
                                        </p>

                                        <p className="mt-1 text-xs font-medium text-slate-600">
                                            {color.helper}
                                        </p>
                                    </div>

                                    <span
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm ring-2 ring-slate-200 ${color.swatchClassName}`}
                                    >
                                        {isSelected ? (
                                            <Check className="h-3.5 w-3.5 text-white" />
                                        ) : null}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {state.errors?.colorPrincipal ? (
                    <p className="text-xs font-semibold text-red-600">
                        {state.errors.colorPrincipal[0]}
                    </p>
                ) : null}
            </div>

            {visibleMessage ? (
                <p
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold ${visibleMessage.ok
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                >
                    {visibleMessage.message}
                </p>
            ) : null}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-2xl bg-(--app-primary) px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? "Guardando..." : "Guardar apariencia"}
                </button>
            </div>
        </form>
    );
}