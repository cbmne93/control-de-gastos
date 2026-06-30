import {
    CreditCard,
    TrendingDown,
    TrendingUp,
    WalletCards,
} from "lucide-react";

import { StatCard } from "@/components/shared";
import { formatDashboardMontoPYG } from "@/features/dashboard/helpers/dashboard-format.helper";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";

interface DashboardStatsProps {
    data: DashboardData;
}

export function DashboardStats({ data }: DashboardStatsProps) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                title="Ingresos del mes"
                value={formatDashboardMontoPYG(data.totalIngresosMes)}
                icon={TrendingUp}
                variant="success"
            />

            <StatCard
                title="Gastos pagados"
                value={formatDashboardMontoPYG(data.totalGastosPagadosMes)}
                icon={TrendingDown}
                variant="danger"
            />

            <StatCard
                title="Balance disponible"
                value={formatDashboardMontoPYG(data.balanceDisponibleMes)}
                icon={WalletCards}
                variant={data.balanceDisponibleMes >= 0 ? "info" : "danger"}
            />

            <StatCard
                title="Compromisos pendientes"
                value={formatDashboardMontoPYG(
                    data.totalCompromisosPendientes,
                )}
                icon={CreditCard}
                variant="warning"
            />
        </section>
    );
}