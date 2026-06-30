import { CalendarClock } from "lucide-react";

import { EmptyState, PageCard } from "@/components/shared";
import {
    formatDashboardFecha,
    formatDashboardMontoPYG,
} from "@/features/dashboard/helpers/dashboard-format.helper";
import type { DashboardVencimientoItem } from "@/features/dashboard/types/dashboard.types";

interface ProximosVencimientosProps {
    vencimientos: DashboardVencimientoItem[];
}

export function ProximosVencimientos({
    vencimientos,
}: ProximosVencimientosProps) {
    return (
        <PageCard>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                    <CalendarClock className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-foreground">
                        Próximos vencimientos
                    </h2>

                    <p className="text-sm text-slate-500">
                        Cuotas pendientes que vencen en los próximos 7 días.
                    </p>
                </div>
            </div>

            {vencimientos.length === 0 ? (
                <EmptyState
                    title="No hay cuotas por vencer"
                    description="Cuando registres gastos con cuotas, vas a ver acá los próximos vencimientos."
                />
            ) : (
                <div className="space-y-3">
                    {vencimientos.map((cuota) => (
                        <div
                            key={cuota.id}
                            className="flex flex-col gap-2 rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3 transition hover:border-(--app-primary-muted) sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-semibold text-foreground">
                                    {cuota.movimiento.descripcion}
                                </p>

                                <p className="text-sm text-slate-500">
                                    Cuota {cuota.numeroCuota} de{" "}
                                    {cuota.totalCuotas} · Vence el{" "}
                                    {formatDashboardFecha(
                                        cuota.fechaVencimiento,
                                    )}
                                </p>
                            </div>

                            <span className="text-sm font-bold text-foreground">
                                {formatDashboardMontoPYG(cuota.monto)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </PageCard>
    );
}