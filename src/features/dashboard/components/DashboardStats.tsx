import type { LucideIcon } from "lucide-react";
import {
    CreditCard,
    TrendingDown,
    TrendingUp,
    WalletCards,
} from "lucide-react";

import { formatDashboardMontoPYG } from "@/features/dashboard/helpers/dashboard-format.helper";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";

interface DashboardStatsProps {
    data: DashboardData;
}

type StatVariant = "success" | "danger" | "info" | "warning";

interface DashboardStatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    variant: StatVariant;
}

const variantClasses: Record<
    StatVariant,
    {
        icon: string;
        value: string;
        iconBox: string;
    }
> = {
    success: {
        icon: "text-emerald-700",
        value: "text-emerald-700",
        iconBox: "bg-emerald-50",
    },
    danger: {
        icon: "text-rose-700",
        value: "text-rose-700",
        iconBox: "bg-rose-50",
    },
    info: {
        icon: "text-sky-700",
        value: "text-sky-700",
        iconBox: "bg-sky-50",
    },
    warning: {
        icon: "text-amber-700",
        value: "text-amber-700",
        iconBox: "bg-amber-50",
    },
};

function DashboardStatCard({
    title,
    value,
    icon: Icon,
    variant,
}: DashboardStatCardProps) {
    const classes = variantClasses[variant];

    return (
        <article className="rounded-2xl border border-(--app-border) bg-card p-3 shadow-sm sm:p-5">
            <div className="flex items-center gap-3 sm:block">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${classes.iconBox}`}
                >
                    <Icon className={`h-5 w-5 ${classes.icon}`} />
                </div>

                <div className="min-w-0 flex-1 sm:mt-4">
                    <div className="flex items-center justify-between gap-3 sm:block">
                        <p className="text-xs font-semibold text-slate-500 sm:text-sm">
                            {title}
                        </p>

                        <p
                            className={`shrink-0 text-right text-sm font-extrabold tracking-tight sm:mt-2 sm:text-left sm:text-2xl ${classes.value}`}
                        >
                            {value}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}

export function DashboardStats({ data }: DashboardStatsProps) {
    return (
        <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            <DashboardStatCard
                title="Ingresos del mes"
                value={formatDashboardMontoPYG(data.totalIngresosMes)}
                icon={TrendingUp}
                variant="success"
            />

            <DashboardStatCard
                title="Gastos pagados"
                value={formatDashboardMontoPYG(data.totalGastosPagadosMes)}
                icon={TrendingDown}
                variant="danger"
            />

            <DashboardStatCard
                title="Balance disponible"
                value={formatDashboardMontoPYG(data.balanceDisponibleMes)}
                icon={WalletCards}
                variant={data.balanceDisponibleMes >= 0 ? "info" : "danger"}
            />

            <DashboardStatCard
                title="Compromisos pendientes"
                value={formatDashboardMontoPYG(
                    data.totalCompromisosPendientes
                )}
                icon={CreditCard}
                variant="warning"
            />
        </section>
    );
}