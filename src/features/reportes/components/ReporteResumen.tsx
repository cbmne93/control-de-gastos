import {
    Banknote,
    CreditCard,
    TrendingDown,
    TrendingUp,
    WalletCards,
    type LucideIcon,
} from "lucide-react";

import { formatReporteMontoPYG } from "@/features/reportes/helpers/reporte-format.helper";
import type { ReporteMensualData } from "@/features/reportes/types/reporte.types";

interface ReporteResumenProps {
    data: ReporteMensualData;
}

type ResumenVariant = "success" | "danger" | "info" | "warning";

interface ResumenCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    variant: ResumenVariant;
}

const variantStyles: Record<
    ResumenVariant,
    {
        icon: string;
        value: string;
    }
> = {
    success: {
        icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        value: "text-foreground",
    },
    danger: {
        icon: "bg-rose-50 text-rose-700 ring-rose-100",
        value: "text-foreground",
    },
    info: {
        icon: "bg-(--app-primary-soft) text-(--app-primary) ring-(--app-primary-muted)",
        value: "text-foreground",
    },
    warning: {
        icon: "bg-amber-50 text-amber-700 ring-amber-100",
        value: "text-foreground",
    },
};

function ResumenCard({ title, value, icon: Icon, variant }: ResumenCardProps) {
    const styles = variantStyles[variant];

    return (
        <article className="min-w-0 overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) p-5 shadow-sm">
            <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${styles.icon}`}
            >
                <Icon className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-600">{title}</p>

            <p
                className={`mt-2 wrap-break-word text-[1.3rem] font-bold leading-tight tracking-tight tabular-nums sm:text-[1.4rem] xl:text-[1.3rem] 2xl:text-[1.45rem] ${styles.value}`}
            >
                {value}
            </p>
        </article>
    );
}

export function ReporteResumen({ data }: ReporteResumenProps) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <ResumenCard
                title="Ingresos"
                value={formatReporteMontoPYG(data.totalIngresos)}
                icon={TrendingUp}
                variant="success"
            />

            <ResumenCard
                title="Gastos pagados"
                value={formatReporteMontoPYG(data.totalGastosPagados)}
                icon={TrendingDown}
                variant="danger"
            />

            <ResumenCard
                title="Cuotas pagadas"
                value={formatReporteMontoPYG(data.totalCuotasPagadas)}
                icon={CreditCard}
                variant="info"
            />

            <ResumenCard
                title="Balance disponible"
                value={formatReporteMontoPYG(data.balanceDisponible)}
                icon={WalletCards}
                variant={data.balanceDisponible >= 0 ? "success" : "danger"}
            />

            <ResumenCard
                title="Pendiente"
                value={formatReporteMontoPYG(data.totalCompromisosPendientes)}
                icon={Banknote}
                variant="warning"
            />
        </section>
    );
}