import Link from "next/link";
import { Search, X } from "lucide-react";

import type { EstadoCuotaFilter } from "@/features/cuotas/types/cuota.types";

interface CuotasFiltersProps {
    query: string;
    estado: EstadoCuotaFilter;
}

export function CuotasFilters({ query, estado }: CuotasFiltersProps) {
    return (
        <form action="/cuotas" className="grid gap-3 sm:flex sm:items-center">
            <div className="relative sm:max-w-sm sm:flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                    name="query"
                    defaultValue={query}
                    placeholder="Buscar gasto con cuotas..."
                    className="h-11 w-full rounded-xl border border-(--app-border) bg-(--app-card) pl-9 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)"
                />

                {query ? (
                    <Link
                        href={`/cuotas?estado=${estado}`}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-(--app-primary-soft) hover:text-(--app-primary)"
                        aria-label="Limpiar búsqueda"
                    >
                        <X className="h-4 w-4" />
                    </Link>
                ) : null}
            </div>

            <select
                name="estado"
                defaultValue={estado}
                className="h-11 rounded-xl border border-(--app-border) bg-(--app-card) px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)"
            >
                <option value="TODOS">Todos</option>
                <option value="PENDIENTE">Con pendientes</option>
                <option value="VENCIDA">Con vencidas</option>
                <option value="PAGADA">Con pagadas</option>
            </select>

            <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-(--app-primary) px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
                Filtrar
            </button>
        </form>
    );
}