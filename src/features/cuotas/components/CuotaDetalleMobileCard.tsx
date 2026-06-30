"use client";

import {
    formatFechaCuota,
    formatMontoPYG,
    getEstadoCuotaBadgeClass,
    getEstadoCuotaLabel,
} from "@/features/cuotas/helpers/cuota-format.helper";
import type { CuotaDetalleItem } from "@/features/cuotas/types/cuota.types";

import { CuotaEstadoIcon } from "./CuotaEstadoIcon";
import { CuotaPagoButton } from "./CuotaPagoButton";

interface CuotaDetalleMobileCardProps {
    cuota: CuotaDetalleItem;
    isPending: boolean;
    onMarcarPagada: (id: string) => void;
    onRestaurarPendiente: (id: string) => void;
}

export function CuotaDetalleMobileCard({
    cuota,
    isPending,
    onMarcarPagada,
    onRestaurarPendiente,
}: CuotaDetalleMobileCardProps) {
    return (
        <article className="rounded-3xl border border-(--app-border) bg-(--app-card) p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--app-card-soft) ring-1 ring-(--app-border)">
                        <CuotaEstadoIcon estado={cuota.estado} />
                    </div>

                    <div>
                        <p className="font-semibold text-foreground">
                            Cuota {cuota.numeroCuota} de {cuota.totalCuotas}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Vence el {formatFechaCuota(cuota.fechaVencimiento)}
                        </p>
                    </div>
                </div>

                <span className="font-bold text-foreground">
                    {formatMontoPYG(cuota.monto)}
                </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getEstadoCuotaBadgeClass(
                        cuota.estado,
                    )}`}
                >
                    {getEstadoCuotaLabel(cuota.estado)}
                </span>

                {cuota.fechaPago ? (
                    <span className="inline-flex rounded-full border border-(--app-border) bg-(--app-card-soft) px-2.5 py-1 text-xs font-semibold text-slate-600">
                        Pagada el {formatFechaCuota(cuota.fechaPago)}
                    </span>
                ) : null}
            </div>

            <div className="mt-4">
                <CuotaPagoButton
                    cuotaId={cuota.id}
                    estado={cuota.estado}
                    isPending={isPending}
                    onMarcarPagada={onMarcarPagada}
                    onRestaurarPendiente={onRestaurarPendiente}
                    fullWidth
                />
            </div>
        </article>
    );
}