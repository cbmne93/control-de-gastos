import { formatMontoPYG } from "@/features/cuotas/helpers/cuota-format.helper";
import type { MovimientoCuotasDetalleItem } from "@/features/cuotas/types/cuota.types";

interface CuotasResumenCardsProps {
    movimiento: MovimientoCuotasDetalleItem;
}

export function CuotasResumenCards({ movimiento }: CuotasResumenCardsProps) {
    return (
        <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-(--app-border) bg-(--app-card) p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                    Total del gasto
                </p>

                <p className="mt-2 text-2xl font-bold text-foreground">
                    {formatMontoPYG(movimiento.total)}
                </p>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                <p className="text-sm font-semibold text-emerald-700">
                    Pagado
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-800">
                    {formatMontoPYG(movimiento.pagado)}
                </p>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
                <p className="text-sm font-semibold text-amber-700">
                    Pendiente
                </p>

                <p className="mt-2 text-2xl font-bold text-amber-800">
                    {formatMontoPYG(movimiento.pendiente)}
                </p>
            </div>
        </section>
    );
}