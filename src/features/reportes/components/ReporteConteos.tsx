import type { ReporteMensualData } from "@/features/reportes/types/reporte.types";

interface ReporteConteosProps {
    data: ReporteMensualData;
}

export function ReporteConteos({ data }: ReporteConteosProps) {
    return (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-2xl border border-(--app-border) bg-(--app-card) px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Ingresos
                </p>

                <p className="mt-1 text-xl font-bold text-emerald-700">
                    {data.cantidadIngresos}
                </p>
            </div>

            <div className="rounded-2xl border border-(--app-border) bg-(--app-card) px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Gastos sin cuotas
                </p>

                <p className="mt-1 text-xl font-bold text-rose-700">
                    {data.cantidadGastosSinCuotas}
                </p>
            </div>

            <div className="rounded-2xl border border-(--app-border) bg-(--app-card) px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cuotas pagadas
                </p>

                <p className="mt-1 text-xl font-bold text-(--app-primary)">
                    {data.cantidadCuotasPagadas}
                </p>
            </div>

            <div className="rounded-2xl border border-(--app-border) bg-(--app-card) px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cuotas pendientes
                </p>

                <p className="mt-1 text-xl font-bold text-amber-700">
                    {data.cantidadCuotasPendientes}
                </p>
            </div>

            <div className="rounded-2xl border border-(--app-border) bg-(--app-card) px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cuotas vencidas
                </p>

                <p className="mt-1 text-xl font-bold text-rose-700">
                    {data.cantidadCuotasVencidas}
                </p>
            </div>
        </section>
    );
}