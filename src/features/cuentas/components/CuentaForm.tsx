"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
    createCuentaAction,
    type CuentaActionState,
} from "../actions/create-cuenta.action";
import { updateCuentaAction } from "../actions/update-cuenta.action";
import { type CuentaListItem } from "../types/cuenta.types";

type CuentaFormProps = {
    cuenta?: CuentaListItem | null;
};

const initialState: CuentaActionState = {};

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
                    : "Crear cuenta"}
        </button>
    );
}

export function CuentaForm({ cuenta }: CuentaFormProps) {
    const editing = Boolean(cuenta);
    const action = editing ? updateCuentaAction : createCuentaAction;
    const [state, formAction] = useActionState(action, initialState);

    return (
        <form action={formAction} className="space-y-5">
            {cuenta ? (
                <input type="hidden" name="id" value={cuenta.id} />
            ) : null}

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(180px,0.75fr)_minmax(180px,0.75fr)_auto] lg:items-start">
                <div className="space-y-2">
                    <label
                        htmlFor="nombre"
                        className="text-sm font-semibold text-slate-700"
                    >
                        Nombre de la cuenta
                    </label>

                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        defaultValue={cuenta?.nombre ?? ""}
                        placeholder="Ej: Efectivo, Banco Familiar, Ueno"
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
                        Tipo de cuenta
                    </label>

                    <select
                        id="tipo"
                        name="tipo"
                        defaultValue={cuenta?.tipo ?? "EFECTIVO"}
                        className={inputClassName}
                    >
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="BANCO">Banco</option>
                        <option value="BILLETERA">Billetera</option>
                        <option value="TARJETA_CREDITO">
                            Tarjeta de crédito
                        </option>
                        <option value="TARJETA_DEBITO">
                            Tarjeta de débito
                        </option>
                        <option value="OTRO">Otro</option>
                    </select>

                    {state.errors?.tipo ? (
                        <p className="text-sm font-medium text-red-600">
                            {state.errors.tipo[0]}
                        </p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="saldoInicial"
                        className="text-sm font-semibold text-slate-700"
                    >
                        Saldo inicial
                    </label>

                    <input
                        id="saldoInicial"
                        name="saldoInicial"
                        type="text"
                        inputMode="decimal"
                        defaultValue={cuenta?.saldoInicial ?? "0"}
                        placeholder="Ej: 500000"
                        className={inputClassName}
                    />

                    <p className="text-xs leading-5 text-slate-500">
                        Podés dejarlo en 0 si todavía no querés cargar saldo
                        inicial.
                    </p>

                    {state.errors?.saldoInicial ? (
                        <p className="text-sm font-medium text-red-600">
                            {state.errors.saldoInicial[0]}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col gap-3 lg:pt-6.5">
                    <SubmitButton editing={editing} />

                    {editing ? (
                        <Link
                            href="/cuentas"
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