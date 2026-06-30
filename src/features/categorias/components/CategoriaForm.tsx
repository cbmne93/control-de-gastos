"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
    createCategoriaAction,
    type CategoriaActionState,
} from "../actions/create-categoria.action";
import { updateCategoriaAction } from "../actions/update-categoria.action";
import { type CategoriaListItem } from "../types/categoria.types";

type CategoriaFormProps = {
    categoria?: CategoriaListItem | null;
};

const initialState: CategoriaActionState = {};

const inputClassName =
    "h-11 w-full rounded-xl border border-(--app-border) bg-(--app-card) px-4 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)";

function SubmitButton({ editing }: { editing: boolean }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-(--app-primary) px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto lg:whitespace-nowrap"
        >
            {pending
                ? editing
                    ? "Guardando..."
                    : "Creando..."
                : editing
                    ? "Guardar cambios"
                    : "Crear categoría"}
        </button>
    );
}

export function CategoriaForm({ categoria }: CategoriaFormProps) {
    const editing = Boolean(categoria);
    const action = editing ? updateCategoriaAction : createCategoriaAction;
    const [state, formAction] = useActionState(action, initialState);

    return (
        <form action={formAction} className="space-y-5">
            {categoria ? (
                <input type="hidden" name="id" value={categoria.id} />
            ) : null}

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.7fr)_auto] lg:items-start">
                <div className="space-y-2">
                    <label
                        htmlFor="nombre"
                        className="text-sm font-semibold text-slate-700"
                    >
                        Nombre de la categoría
                    </label>

                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        defaultValue={categoria?.nombre ?? ""}
                        placeholder="Ej: Alimentación, Transporte, Salario"
                        className={inputClassName}
                    />

                    {state.errors?.nombre ? (
                        <p className="text-sm font-medium text-red-600">
                            {state.errors.nombre[0]}
                        </p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="tipo"
                        className="text-sm font-semibold text-slate-700"
                    >
                        Tipo de movimiento
                    </label>

                    <select
                        id="tipo"
                        name="tipo"
                        defaultValue={categoria?.tipo ?? "GASTO"}
                        className={inputClassName}
                    >
                        <option value="GASTO">Gasto</option>
                        <option value="INGRESO">Ingreso</option>
                    </select>

                    {state.errors?.tipo ? (
                        <p className="text-sm font-medium text-red-600">
                            {state.errors.tipo[0]}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col gap-3 lg:pt-6.5">
                    <SubmitButton editing={editing} />

                    {editing ? (
                        <Link
                            href="/categorias"
                            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-(--app-border) bg-(--app-card) px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary) lg:w-auto"
                        >
                            Cancelar
                        </Link>
                    ) : null}
                </div>
            </div>

            {state.message ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {state.message}
                </div>
            ) : null}
        </form>
    );
}