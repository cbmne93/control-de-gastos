import { CalendarClock } from "lucide-react";

import type {
    EstadoCuotaFilter,
    MovimientoConCuotasItem,
} from "@/features/cuotas/types/cuota.types";

import { CuotasFilters } from "./CuotasFilters";
import { MovimientoCuotasCard } from "./MovimientoCuotasCard";

interface MovimientosCuotasListProps {
    movimientos: MovimientoConCuotasItem[];
    query?: string;
    estado?: EstadoCuotaFilter;
}

export function MovimientosCuotasList({
    movimientos,
    query = "",
    estado = "TODOS",
}: MovimientosCuotasListProps) {
    return (
        <div className="space-y-5">
            <CuotasFilters query={query} estado={estado} />

            {movimientos.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-(--app-border) bg-(--app-card-soft) px-6 py-12 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                        <CalendarClock className="h-5 w-5" />
                    </div>

                    <h2 className="mt-4 text-base font-semibold text-foreground">
                        No hay gastos con cuotas
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Cuando registres un gasto con cuotas, aparecerá agrupado
                        en esta vista.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                    {movimientos.map((movimiento) => (
                        <MovimientoCuotasCard
                            key={movimiento.id}
                            movimiento={movimiento}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}