import { CalendarClock, CheckCircle2, Clock } from "lucide-react";

import type { MovimientoCuotasDetalleItem } from "@/features/cuotas/types/cuota.types";

import { CuotaProgressBar } from "./CuotaProgressBar";

interface CuotasDetalleProgressProps {
    movimiento: MovimientoCuotasDetalleItem;
}

export function CuotasDetalleProgress({
    movimiento,
}: CuotasDetalleProgressProps) {
    return (
        <section className="rounded-3xl border border-(--app-border) bg-(--app-card) p-5 shadow-sm">
            <CuotaProgressBar
                pagadas={movimiento.cuotasPagadas}
                total={movimiento.totalCuotas}
            />

            <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {movimiento.cuotasPagadas} pagadas
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <Clock className="h-3.5 w-3.5" />
                    {movimiento.cuotasPendientes} pendientes
                </span>

                {movimiento.cuotasVencidas > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {movimiento.cuotasVencidas} vencidas
                    </span>
                ) : null}
            </div>
        </section>
    );
}