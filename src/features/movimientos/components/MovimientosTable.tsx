import {
    formatFechaMovimiento,
    formatMontoPYG,
    getMovimientoTipoBadgeClass,
    getMovimientoTipoLabel,
} from "@/features/movimientos/helpers/movimiento-format.helper";
import type { MovimientoListItem } from "@/features/movimientos/types/movimiento.types";

import { MovimientoActions } from "./MovimientoActions";
import { MovimientoTipoIcon } from "./MovimientoTipoIcon";

interface MovimientosTableProps {
    movimientos: MovimientoListItem[];
    isPending: boolean;
    onDelete: (id: string) => void;
}

export function MovimientosTable({
    movimientos,
    isPending,
    onDelete,
}: MovimientosTableProps) {
    return (
        <div className="hidden overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) shadow-sm lg:block">
            <table className="w-full text-left text-sm">
                <thead className="bg-(--app-card-soft) text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-5 py-4 font-semibold">Fecha</th>
                        <th className="px-5 py-4 font-semibold">
                            Movimiento
                        </th>
                        <th className="px-5 py-4 font-semibold">
                            Categoría
                        </th>
                        <th className="px-5 py-4 font-semibold">Cuenta</th>
                        <th className="px-5 py-4 text-right font-semibold">
                            Monto
                        </th>
                        <th className="px-5 py-4 text-right font-semibold">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-(--app-border)">
                    {movimientos.map((movimiento) => (
                        <tr
                            key={movimiento.id}
                            className="transition hover:bg-(--app-card-soft)"
                        >
                            <td className="px-5 py-4 text-slate-600">
                                {formatFechaMovimiento(movimiento.fecha)}
                            </td>

                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--app-card-soft) ring-1 ring-(--app-border)">
                                        <MovimientoTipoIcon
                                            tipo={movimiento.tipo}
                                        />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-foreground">
                                            {movimiento.descripcion}
                                        </p>

                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                            <span
                                                className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getMovimientoTipoBadgeClass(
                                                    movimiento.tipo,
                                                )}`}
                                            >
                                                {getMovimientoTipoLabel(
                                                    movimiento.tipo,
                                                )}
                                            </span>

                                            {movimiento.tieneCuotas ? (
                                                <span className="inline-flex rounded-full border border-(--app-primary-muted) bg-(--app-primary-soft) px-2 py-0.5 text-xs font-semibold text-(--app-primary)">
                                                    Cuotas
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                                {movimiento.categoria.nombre}
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                                {movimiento.cuenta.nombre}
                            </td>

                            <td className="px-5 py-4 text-right">
                                <span
                                    className={
                                        movimiento.tipo === "INGRESO"
                                            ? "font-bold text-emerald-700"
                                            : "font-bold text-rose-700"
                                    }
                                >
                                    {movimiento.tipo === "INGRESO" ? "+" : "-"}
                                    {formatMontoPYG(movimiento.monto)}
                                </span>
                            </td>

                            <td className="px-5 py-4">
                                <MovimientoActions
                                    movimientoId={movimiento.id}
                                    tieneCuotas={movimiento.tieneCuotas}
                                    isPending={isPending}
                                    onDelete={onDelete}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}