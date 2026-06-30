import Link from "next/link";
import { Search, X } from "lucide-react";

import type { MovimientoTipoFilter } from "@/features/movimientos/types/movimiento.types";

interface MovimientosFiltersProps {
    query: string;
    tipo: MovimientoTipoFilter;
}

function getClearSearchHref(tipo: MovimientoTipoFilter) {
    if (tipo === "TODOS") {
        return "/movimientos";
    }

    return `/movimientos?tipo=${tipo}`;
}

export function MovimientosFilters({ query, tipo }: MovimientosFiltersProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form
                action="/movimientos"
                className="grid w-full gap-3 sm:flex sm:items-center"
            >
                <div className="relative sm:max-w-sm sm:flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        name="query"
                        defaultValue={query}
                        placeholder="Buscar movimiento..."
                        className="h-11 w-full rounded-xl border border-(--app-border) bg-(--app-card) pl-9 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)"
                    />

                    {query ? (
                        <Link
                            href={getClearSearchHref(tipo)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-(--app-primary-soft) hover:text-(--app-primary)"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="h-4 w-4" />
                        </Link>
                    ) : null}
                </div>

                <select
                    name="tipo"
                    defaultValue={tipo}
                    className="h-11 rounded-xl border border-(--app-border) bg-(--app-card) px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)"
                >
                    <option value="TODOS">Todos</option>
                    <option value="GASTO">Gastos</option>
                    <option value="INGRESO">Ingresos</option>
                </select>

                <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-(--app-primary) px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                    Filtrar
                </button>
            </form>
        </div>
    );
}