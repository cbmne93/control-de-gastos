import { EmptyState } from "@/components/shared";
import { formatReporteMontoPYG } from "@/features/reportes/helpers";
import type { ReporteResumenItem } from "@/features/reportes/types/reporte.types";

interface ReporteResumenTableProps {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    items: ReporteResumenItem[];
}

function getAmountClass(value: number) {
    if (value > 0) {
        return "text-emerald-700";
    }

    if (value < 0) {
        return "text-rose-700";
    }

    return "text-foreground";
}

interface AmountBoxProps {
    label: string;
    value: number;
}

function AmountBox({ label, value }: AmountBoxProps) {
    return (
        <div className="min-w-0 rounded-xl border border-(--app-border) bg-(--app-card) px-3 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p
                className={`mt-1 truncate text-sm font-bold tabular-nums ${getAmountClass(
                    value,
                )}`}
                title={formatReporteMontoPYG(value)}
            >
                {formatReporteMontoPYG(value)}
            </p>
        </div>
    );
}

export function ReporteResumenTable({
    title,
    description,
    emptyTitle,
    emptyDescription,
    items,
}: ReporteResumenTableProps) {
    return (
        <section className="min-w-0 rounded-3xl border border-(--app-border) bg-(--app-card) p-5 shadow-sm">
            <div>
                <h2 className="text-lg font-bold text-foreground">{title}</h2>

                <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>

            {items.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        title={emptyTitle}
                        description={emptyDescription}
                    />
                </div>
            ) : (
                <div className="mt-5 space-y-3">
                    {items.map((item) => (
                        <article
                            key={item.id}
                            className="rounded-2xl border border-(--app-border) bg-(--app-card-soft) p-4"
                        >
                            <p className="wrap-break-word text-sm font-bold text-foreground">
                                {item.nombre}
                            </p>

                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                <AmountBox
                                    label="Ingresos"
                                    value={item.ingresos}
                                />

                                <AmountBox
                                    label="Gastos"
                                    value={-item.gastos}
                                />

                                <AmountBox
                                    label="Balance"
                                    value={item.balance}
                                />
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}