import {
    formatFechaMovimiento,
    formatMontoPYG,
    getMovimientoTipoBadgeClass,
    getMovimientoTipoLabel,
} from "@/features/movimientos/helpers/movimiento-format.helper";
import type { MovimientoListItem } from "@/features/movimientos/types/movimiento.types";

import { MovimientoActions } from "./MovimientoActions";
import { MovimientoTipoIcon } from "./MovimientoTipoIcon";

interface MovimientoMobileCardProps {
    movimiento: MovimientoListItem;
    isPending: boolean;
    onDelete: (id: string) => void;
}

export function MovimientoMobileCard({
    movimiento,
    isPending,
    onDelete,
}: MovimientoMobileCardProps) {
    return (
        <div className="rounded-3xl border border-(--app-border) bg-(--app-card) p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--app-card-soft) ring-1 ring-(--app-border)">
                        <MovimientoTipoIcon tipo={movimiento.tipo} />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">
                            {movimiento.descripcion}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            {formatFechaMovimiento(movimiento.fecha)}
                        </p>
                    </div>
                </div>

                <span
                    className={
                        movimiento.tipo === "INGRESO"
                            ? "shrink-0 font-bold text-emerald-700"
                            : "shrink-0 font-bold text-rose-700"
                    }
                >
                    {movimiento.tipo === "INGRESO" ? "+" : "-"}
                    {formatMontoPYG(movimiento.monto)}
                </span>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Categoría</span>

                    <span className="font-medium text-slate-800">
                        {movimiento.categoria.nombre}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Cuenta</span>

                    <span className="font-medium text-slate-800">
                        {movimiento.cuenta.nombre}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getMovimientoTipoBadgeClass(
                        movimiento.tipo,
                    )}`}
                >
                    {getMovimientoTipoLabel(movimiento.tipo)}
                </span>

                {movimiento.tieneCuotas ? (
                    <span className="inline-flex rounded-full border border-(--app-primary-muted) bg-(--app-primary-soft) px-2 py-0.5 text-xs font-semibold text-(--app-primary)">
                        Cuotas
                    </span>
                ) : null}
            </div>

            <MovimientoActions
                movimientoId={movimiento.id}
                tieneCuotas={movimiento.tieneCuotas}
                isPending={isPending}
                onDelete={onDelete}
                mobile
            />
        </div>
    );
}