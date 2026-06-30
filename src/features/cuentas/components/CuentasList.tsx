import Link from "next/link";
import {
    Banknote,
    Building2,
    CreditCard,
    Pencil,
    Power,
    PowerOff,
    Smartphone,
    Trash2,
    Wallet,
} from "lucide-react";

import { Pagination } from "@/components/shared/Pagination";

import { deleteCuentaAction } from "../actions/delete-cuenta.action";
import { toggleCuentaEstadoAction } from "../actions/toggle-cuenta-estado.action";
import {
    type CuentaListItem,
    type CuentaPagination,
} from "../types/cuenta.types";

type CuentasListProps = {
    cuentas: CuentaListItem[];
    pagination: CuentaPagination;
};

function getTipoLabel(tipo: string) {
    const labels: Record<string, string> = {
        EFECTIVO: "Efectivo",
        BANCO: "Banco",
        BILLETERA: "Billetera",
        TARJETA_CREDITO: "Tarjeta de crédito",
        TARJETA_DEBITO: "Tarjeta de débito",
        OTRO: "Otro",
    };

    return labels[tipo] ?? tipo;
}

function getTipoIcon(tipo: string) {
    const icons = {
        EFECTIVO: Banknote,
        BANCO: Building2,
        BILLETERA: Smartphone,
        TARJETA_CREDITO: CreditCard,
        TARJETA_DEBITO: CreditCard,
        OTRO: Wallet,
    };

    return icons[tipo as keyof typeof icons] ?? Wallet;
}

function formatGuaranies(value: string) {
    return new Intl.NumberFormat("es-PY", {
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function getEstadoClassName(activo: boolean) {
    return activo
        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
        : "bg-slate-100 text-slate-600 ring-slate-200";
}

function getSaldoClassName(value: string) {
    const saldo = Number(value);

    if (saldo > 0) {
        return "text-emerald-700";
    }

    if (saldo < 0) {
        return "text-rose-700";
    }

    return "text-foreground";
}

export function CuentasList({ cuentas, pagination }: CuentasListProps) {
    if (cuentas.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-(--app-border) bg-(--app-card-soft) p-8 text-center">
                <h3 className="text-sm font-bold text-foreground">
                    Todavía no hay cuentas
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                    Creá tus primeras cuentas para registrar de dónde entra o
                    sale el dinero.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                <p className="text-sm text-slate-500">
                    Mostrando{" "}
                    <span className="font-bold text-foreground">
                        {cuentas.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-bold text-foreground">
                        {pagination.totalItems}
                    </span>{" "}
                    cuenta
                    {pagination.totalItems === 1 ? "" : "s"}.
                </p>
            </div>

            <div className="hidden overflow-hidden rounded-2xl border border-(--app-border) bg-(--app-card) shadow-sm md:block">
                <table className="w-full text-left text-sm">
                    <thead className="bg-(--app-card-soft) text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Cuenta</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3 text-right">
                                Saldo actual
                            </th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-(--app-border)">
                        {cuentas.map((cuenta) => {
                            const Icon = getTipoIcon(cuenta.tipo);
                            const puedeEliminar =
                                cuenta.movimientosCount === 0;

                            return (
                                <tr
                                    key={cuenta.id}
                                    className="transition hover:bg-(--app-card-soft)"
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="font-semibold text-foreground">
                                                    {cuenta.nombre}
                                                </p>

                                                <p className="mt-0.5 text-xs font-medium text-slate-500">
                                                    {cuenta.movimientosCount}{" "}
                                                    movimiento
                                                    {cuenta.movimientosCount ===
                                                        1
                                                        ? ""
                                                        : "s"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className="inline-flex rounded-full bg-(--app-primary-soft) px-2.5 py-1 text-xs font-bold text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                                            {getTipoLabel(cuenta.tipo)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 text-right">
                                        <p
                                            className={`font-bold ${getSaldoClassName(
                                                cuenta.saldoActual,
                                            )}`}
                                        >
                                            {formatGuaranies(
                                                cuenta.saldoActual,
                                            )}
                                        </p>

                                        <p className="mt-0.5 text-xs font-medium text-slate-500">
                                            Inicial:{" "}
                                            {formatGuaranies(
                                                cuenta.saldoInicial,
                                            )}
                                        </p>
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${getEstadoClassName(
                                                cuenta.activo,
                                            )}`}
                                        >
                                            {cuenta.activo
                                                ? "Activa"
                                                : "Inactiva"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/cuentas?edit=${cuenta.id}&page=${pagination.currentPage}`}
                                                title="Editar"
                                                aria-label={`Editar ${cuenta.nombre}`}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--app-primary-muted) bg-(--app-primary-soft) text-(--app-primary) shadow-sm transition hover:opacity-90"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>

                                            <form
                                                action={
                                                    toggleCuentaEstadoAction
                                                }
                                            >
                                                <input
                                                    type="hidden"
                                                    name="id"
                                                    value={cuenta.id}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="activo"
                                                    value={String(
                                                        cuenta.activo,
                                                    )}
                                                />

                                                <button
                                                    type="submit"
                                                    title={
                                                        cuenta.activo
                                                            ? "Desactivar"
                                                            : "Activar"
                                                    }
                                                    aria-label={
                                                        cuenta.activo
                                                            ? `Desactivar ${cuenta.nombre}`
                                                            : `Activar ${cuenta.nombre}`
                                                    }
                                                    className={[
                                                        "inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition",
                                                        cuenta.activo
                                                            ? "border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                                                            : "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800",
                                                    ].join(" ")}
                                                >
                                                    {cuenta.activo ? (
                                                        <PowerOff className="h-4 w-4" />
                                                    ) : (
                                                        <Power className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </form>

                                            {puedeEliminar ? (
                                                <form
                                                    action={deleteCuentaAction}
                                                >
                                                    <input
                                                        type="hidden"
                                                        name="id"
                                                        value={cuenta.id}
                                                    />

                                                    <button
                                                        type="submit"
                                                        title="Eliminar"
                                                        aria-label={`Eliminar ${cuenta.nombre}`}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-700 shadow-sm transition hover:bg-rose-100 hover:text-rose-800"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </form>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="space-y-3 md:hidden">
                {cuentas.map((cuenta) => {
                    const Icon = getTipoIcon(cuenta.tipo);
                    const puedeEliminar = cuenta.movimientosCount === 0;

                    return (
                        <div
                            key={cuenta.id}
                            className="rounded-2xl border border-(--app-border) bg-(--app-card) p-4 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="wrap-break-word font-bold text-foreground">
                                            {cuenta.nombre}
                                        </p>

                                        <p className="mt-1 text-xs font-medium text-slate-500">
                                            {getTipoLabel(cuenta.tipo)}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${getEstadoClassName(
                                        cuenta.activo,
                                    )}`}
                                >
                                    {cuenta.activo ? "Activa" : "Inactiva"}
                                </span>
                            </div>

                            <div className="mt-4 rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                                <p className="text-xs font-medium text-slate-500">
                                    Saldo actual
                                </p>

                                <p
                                    className={`mt-1 text-lg font-bold ${getSaldoClassName(
                                        cuenta.saldoActual,
                                    )}`}
                                >
                                    {formatGuaranies(cuenta.saldoActual)}
                                </p>

                                <p className="mt-1 text-xs font-medium text-slate-500">
                                    Saldo inicial:{" "}
                                    {formatGuaranies(cuenta.saldoInicial)}
                                </p>
                            </div>

                            <div className="mt-3 rounded-2xl bg-(--app-card-soft) px-4 py-3">
                                <p className="text-xs font-medium text-slate-500">
                                    Movimientos vinculados:{" "}
                                    <span className="font-bold text-slate-700">
                                        {cuenta.movimientosCount}
                                    </span>
                                </p>
                            </div>

                            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                                <Link
                                    href={`/cuentas?edit=${cuenta.id}&page=${pagination.currentPage}`}
                                    title="Editar"
                                    aria-label={`Editar ${cuenta.nombre}`}
                                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-(--app-primary-muted) bg-(--app-primary-soft) px-3 text-sm font-bold text-(--app-primary) shadow-sm sm:w-auto"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Editar
                                </Link>

                                <form action={toggleCuentaEstadoAction}>
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={cuenta.id}
                                    />

                                    <input
                                        type="hidden"
                                        name="activo"
                                        value={String(cuenta.activo)}
                                    />

                                    <button
                                        type="submit"
                                        title={
                                            cuenta.activo
                                                ? "Desactivar"
                                                : "Activar"
                                        }
                                        aria-label={
                                            cuenta.activo
                                                ? `Desactivar ${cuenta.nombre}`
                                                : `Activar ${cuenta.nombre}`
                                        }
                                        className={[
                                            "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold shadow-sm sm:w-auto",
                                            cuenta.activo
                                                ? "border-amber-100 bg-amber-50 text-amber-700"
                                                : "border-emerald-100 bg-emerald-50 text-emerald-700",
                                        ].join(" ")}
                                    >
                                        {cuenta.activo ? (
                                            <>
                                                <PowerOff className="h-4 w-4" />
                                                Desactivar
                                            </>
                                        ) : (
                                            <>
                                                <Power className="h-4 w-4" />
                                                Activar
                                            </>
                                        )}
                                    </button>
                                </form>

                                {puedeEliminar ? (
                                    <form action={deleteCuentaAction}>
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={cuenta.id}
                                        />

                                        <button
                                            type="submit"
                                            title="Eliminar"
                                            aria-label={`Eliminar ${cuenta.nombre}`}
                                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 text-sm font-bold text-rose-700 shadow-sm sm:w-auto"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Eliminar
                                        </button>
                                    </form>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                basePath="/cuentas"
            />
        </div>
    );
}