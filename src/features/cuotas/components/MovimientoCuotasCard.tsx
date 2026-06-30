import Link from "next/link";
import { CalendarClock, CheckCircle2, Clock, Eye } from "lucide-react";

import {
    formatFechaCuota,
    formatMontoPYG,
} from "@/features/cuotas/helpers/cuota-format.helper";
import type { MovimientoConCuotasItem } from "@/features/cuotas/types/cuota.types";

import { CuotaProgressBar } from "./CuotaProgressBar";

interface MovimientoCuotasCardProps {
    movimiento: MovimientoConCuotasItem;
}

export function MovimientoCuotasCard({
    movimiento,
}: MovimientoCuotasCardProps) {
    return (
        <article className="rounded-3xl border border-(--app-border) bg-(--app-card) p-5 shadow-sm transition hover:border-(--app-primary-muted)">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                        <CalendarClock className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-base font-bold text-foreground">
                            {movimiento.descripcion}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {movimiento.categoria.nombre} ·{" "}
                            {movimiento.cuenta.nombre}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
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
                    </div>
                </div>

                <Link
                    href={`/cuotas/${movimiento.id}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-(--app-primary-muted) bg-(--app-primary-soft) px-3 py-2 text-sm font-semibold text-(--app-primary) shadow-sm transition hover:opacity-90"
                >
                    <Eye className="h-4 w-4" />
                    Ver cuotas
                </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total
                    </p>

                    <p className="mt-1 text-base font-bold text-foreground">
                        {formatMontoPYG(movimiento.total)}
                    </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Pagado
                    </p>

                    <p className="mt-1 text-base font-bold text-emerald-800">
                        {formatMontoPYG(movimiento.pagado)}
                    </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                        Pendiente
                    </p>

                    <p className="mt-1 text-base font-bold text-amber-800">
                        {formatMontoPYG(movimiento.pendiente)}
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <CuotaProgressBar
                    pagadas={movimiento.cuotasPagadas}
                    total={movimiento.totalCuotas}
                />
            </div>

            <div className="mt-5 rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                {movimiento.proximaCuota ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Próximo vencimiento
                            </p>

                            <p className="text-sm text-slate-500">
                                Cuota {movimiento.proximaCuota.numeroCuota} de{" "}
                                {movimiento.proximaCuota.totalCuotas} ·{" "}
                                {formatFechaCuota(
                                    movimiento.proximaCuota.fechaVencimiento,
                                )}
                            </p>
                        </div>

                        <span className="text-sm font-bold text-foreground">
                            {formatMontoPYG(movimiento.proximaCuota.monto)}
                        </span>
                    </div>
                ) : (
                    <p className="text-sm font-semibold text-emerald-700">
                        Todas las cuotas están pagadas.
                    </p>
                )}
            </div>
        </article>
    );
}