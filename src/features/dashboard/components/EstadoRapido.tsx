import { Bell } from "lucide-react";

import { PageCard } from "@/components/shared";
import { formatDashboardMontoPYG } from "@/features/dashboard/helpers/dashboard-format.helper";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";

interface EstadoRapidoProps {
    data: DashboardData;
}

export function EstadoRapido({ data }: EstadoRapidoProps) {
    return (
        <PageCard>
            <h2 className="text-lg font-bold text-foreground">
                Estado rápido
            </h2>

            <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">
                        Movimientos este mes
                    </span>

                    <span className="text-sm font-bold text-foreground">
                        {data.movimientosMes}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">
                        Gastos sin cuotas
                    </span>

                    <span className="text-sm font-bold text-rose-700">
                        {formatDashboardMontoPYG(
                            data.totalGastosSinCuotasMes,
                        )}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">
                        Cuotas pagadas mes
                    </span>

                    <span className="text-sm font-bold text-emerald-700">
                        {formatDashboardMontoPYG(data.totalCuotasPagadasMes)}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">
                        Cuotas pendientes
                    </span>

                    <span className="text-sm font-bold text-(--app-primary)">
                        {data.cuotasPendientes}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">
                        Cuotas vencidas
                    </span>

                    <span className="text-sm font-bold text-rose-700">
                        {data.cuotasVencidas}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">
                        Vencen pronto
                    </span>

                    <span className="text-sm font-bold text-amber-700">
                        {data.cuotasPorVencer}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">
                        Pagadas este mes
                    </span>

                    <span className="text-sm font-bold text-emerald-700">
                        {data.cuotasPagadasMes}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">
                        Notificaciones
                    </span>

                    <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700">
                        <Bell className="h-4 w-4" />
                        {data.notificacionesPendientes}
                    </span>
                </div>
            </div>
        </PageCard>
    );
}