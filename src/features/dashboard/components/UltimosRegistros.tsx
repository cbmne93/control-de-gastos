import { ArrowDownCircle, ArrowUpCircle, WalletCards } from "lucide-react";

import { EmptyState, PageCard } from "@/components/shared";
import {
    formatDashboardFecha,
    formatDashboardMontoPYG,
} from "@/features/dashboard/helpers/dashboard-format.helper";
import type { DashboardUltimoRegistroItem } from "@/features/dashboard/types/dashboard.types";

interface UltimosRegistrosProps {
    registros: DashboardUltimoRegistroItem[];
}

export function UltimosRegistros({ registros }: UltimosRegistrosProps) {
    return (
        <PageCard>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                        <WalletCards className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-foreground">
                            Últimos registros
                        </h2>

                        <p className="text-sm text-slate-500">
                            Ingresos, gastos directos y gastos cargados en
                            cuotas.
                        </p>
                    </div>
                </div>
            </div>

            {registros.length === 0 ? (
                <EmptyState
                    title="Todavía no hay movimientos"
                    description="Cuando registres ingresos o gastos, vas a verlos resumidos en esta sección."
                />
            ) : (
                <div className="space-y-3">
                    {registros.map((movimiento) => {
                        const isIngreso = movimiento.tipo === "INGRESO";
                        const isGastoConCuotas =
                            movimiento.tipo === "GASTO" &&
                            movimiento.tieneCuotas;

                        return (
                            <div
                                key={movimiento.id}
                                className="flex flex-col gap-3 rounded-2xl border border-(--app-border) bg-(--app-card) px-4 py-3 shadow-sm transition hover:bg-(--app-card-soft) sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--app-card-soft) ring-1 ring-(--app-border)">
                                        {isIngreso ? (
                                            <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                                        ) : (
                                            <ArrowDownCircle className="h-5 w-5 text-rose-600" />
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-foreground">
                                            {movimiento.descripcion}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {formatDashboardFecha(
                                                movimiento.fecha,
                                            )}{" "}
                                            · {movimiento.categoria.nombre} ·{" "}
                                            {movimiento.cuenta.nombre}
                                        </p>

                                        {isGastoConCuotas ? (
                                            <span className="mt-2 inline-flex rounded-full border border-(--app-primary-muted) bg-(--app-primary-soft) px-2.5 py-1 text-xs font-semibold text-(--app-primary)">
                                                Gasto en cuotas
                                            </span>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="text-left sm:text-right">
                                    <span
                                        className={
                                            isIngreso
                                                ? "text-sm font-bold text-emerald-700"
                                                : "text-sm font-bold text-rose-700"
                                        }
                                    >
                                        {isIngreso ? "+" : "-"}
                                        {formatDashboardMontoPYG(
                                            movimiento.monto,
                                        )}
                                    </span>

                                    {isGastoConCuotas ? (
                                        <p className="mt-1 text-xs font-medium text-slate-500">
                                            Total registrado, no descontado
                                            completo.
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </PageCard>
    );
}