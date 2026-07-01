import Link from "next/link";
import { Pencil, Power, PowerOff, Trash2 } from "lucide-react";

import { Pagination } from "@/components/shared/Pagination";

import { deleteCategoriaAction } from "../actions/delete-categoria.action";
import { toggleCategoriaEstadoAction } from "../actions/toggle-categoria-estado.action";
import {
    type CategoriaListItem,
    type CategoriaPagination,
} from "../types/categoria.types";

type CategoriasListProps = {
    categorias: CategoriaListItem[];
    pagination: CategoriaPagination;
};

function getTipoLabel(tipo: string) {
    return tipo === "INGRESO" ? "Ingreso" : "Gasto";
}

function getTipoClassName(tipo: string) {
    return tipo === "INGRESO"
        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
        : "bg-rose-50 text-rose-700 ring-rose-100";
}

function getEstadoClassName(activo: boolean) {
    return activo
        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
        : "bg-slate-100 text-slate-600 ring-slate-200";
}

export function CategoriasList({
    categorias,
    pagination,
}: CategoriasListProps) {
    if (categorias.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-(--app-border) bg-(--app-card-soft) p-8 text-center">
                <h3 className="text-sm font-bold text-foreground">
                    Todavía no hay categorías
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                    Creá tus primeras categorías para ordenar ingresos y gastos.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="hidden rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3 sm:block">
                <p className="text-sm text-slate-500">
                    Mostrando{" "}
                    <span className="font-bold text-foreground">
                        {categorias.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-bold text-foreground">
                        {pagination.totalItems}
                    </span>{" "}
                    categoría
                    {pagination.totalItems === 1 ? "" : "s"}.
                </p>
            </div>

            <div className="hidden overflow-hidden rounded-2xl border border-(--app-border) bg-(--app-card) shadow-sm md:block">
                <table className="w-full text-left text-sm">
                    <thead className="bg-(--app-card-soft) text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-(--app-border)">
                        {categorias.map((categoria) => {
                            const puedeEliminar =
                                categoria.movimientosCount === 0;

                            return (
                                <tr
                                    key={categoria.id}
                                    className="transition hover:bg-(--app-card-soft)"
                                >
                                    <td className="px-4 py-4">
                                        <p className="font-semibold text-foreground">
                                            {categoria.nombre}
                                        </p>

                                        {categoria.movimientosCount > 0 ? (
                                            <p className="mt-1 text-xs font-medium text-slate-500">
                                                Usada en{" "}
                                                {
                                                    categoria.movimientosCount
                                                }{" "}
                                                movimiento
                                                {categoria.movimientosCount ===
                                                    1
                                                    ? ""
                                                    : "s"}
                                            </p>
                                        ) : null}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${getTipoClassName(
                                                categoria.tipo,
                                            )}`}
                                        >
                                            {getTipoLabel(categoria.tipo)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${getEstadoClassName(
                                                categoria.activo,
                                            )}`}
                                        >
                                            {categoria.activo
                                                ? "Activa"
                                                : "Inactiva"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/categorias?edit=${categoria.id}`}
                                                title="Editar"
                                                aria-label={`Editar ${categoria.nombre}`}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--app-primary-muted) bg-(--app-primary-soft) text-(--app-primary) shadow-sm transition hover:opacity-90"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>

                                            <form
                                                action={
                                                    toggleCategoriaEstadoAction
                                                }
                                            >
                                                <input
                                                    type="hidden"
                                                    name="id"
                                                    value={categoria.id}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="activo"
                                                    value={String(
                                                        categoria.activo,
                                                    )}
                                                />

                                                <button
                                                    type="submit"
                                                    title={
                                                        categoria.activo
                                                            ? "Desactivar"
                                                            : "Activar"
                                                    }
                                                    aria-label={
                                                        categoria.activo
                                                            ? `Desactivar ${categoria.nombre}`
                                                            : `Activar ${categoria.nombre}`
                                                    }
                                                    className={[
                                                        "inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition",
                                                        categoria.activo
                                                            ? "border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                                                            : "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800",
                                                    ].join(" ")}
                                                >
                                                    {categoria.activo ? (
                                                        <PowerOff className="h-4 w-4" />
                                                    ) : (
                                                        <Power className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </form>

                                            {puedeEliminar ? (
                                                <form
                                                    action={
                                                        deleteCategoriaAction
                                                    }
                                                >
                                                    <input
                                                        type="hidden"
                                                        name="id"
                                                        value={categoria.id}
                                                    />

                                                    <button
                                                        type="submit"
                                                        title="Eliminar"
                                                        aria-label={`Eliminar ${categoria.nombre}`}
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
                {categorias.map((categoria) => {
                    const puedeEliminar = categoria.movimientosCount === 0;

                    return (
                        <div
                            key={categoria.id}
                            className="rounded-2xl border border-(--app-border) bg-(--app-card) p-4 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="wrap-break-word font-bold text-foreground">
                                        {categoria.nombre}
                                    </p>

                                    {categoria.movimientosCount > 0 ? (
                                        <p className="mt-1 text-xs font-medium text-slate-500">
                                            Usada en{" "}
                                            {categoria.movimientosCount}{" "}
                                            movimiento
                                            {categoria.movimientosCount === 1
                                                ? ""
                                                : "s"}
                                        </p>
                                    ) : null}
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${getTipoClassName(
                                        categoria.tipo,
                                    )}`}
                                >
                                    {getTipoLabel(categoria.tipo)}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <span
                                    className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${getEstadoClassName(
                                        categoria.activo,
                                    )}`}
                                >
                                    {categoria.activo ? "Activa" : "Inactiva"}
                                </span>

                                <div className="flex flex-wrap gap-2 sm:justify-end">
                                    <Link
                                        href={`/categorias?edit=${categoria.id}`}
                                        title="Editar"
                                        aria-label={`Editar ${categoria.nombre}`}
                                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-(--app-primary-muted) bg-(--app-primary-soft) px-3 text-sm font-bold text-(--app-primary) shadow-sm sm:flex-none"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Editar
                                    </Link>

                                    <form
                                        action={toggleCategoriaEstadoAction}
                                        className="flex-1 sm:flex-none"
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={categoria.id}
                                        />

                                        <input
                                            type="hidden"
                                            name="activo"
                                            value={String(categoria.activo)}
                                        />

                                        <button
                                            type="submit"
                                            title={
                                                categoria.activo
                                                    ? "Desactivar"
                                                    : "Activar"
                                            }
                                            aria-label={
                                                categoria.activo
                                                    ? `Desactivar ${categoria.nombre}`
                                                    : `Activar ${categoria.nombre}`
                                            }
                                            className={[
                                                "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold shadow-sm",
                                                categoria.activo
                                                    ? "border-amber-100 bg-amber-50 text-amber-700"
                                                    : "border-emerald-100 bg-emerald-50 text-emerald-700",
                                            ].join(" ")}
                                        >
                                            {categoria.activo ? (
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
                                        <form
                                            action={deleteCategoriaAction}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={categoria.id}
                                            />

                                            <button
                                                type="submit"
                                                title="Eliminar"
                                                aria-label={`Eliminar ${categoria.nombre}`}
                                                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 text-sm font-bold text-rose-700 shadow-sm"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Eliminar
                                            </button>
                                        </form>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                basePath="/categorias"
            />
        </div>
    );
}