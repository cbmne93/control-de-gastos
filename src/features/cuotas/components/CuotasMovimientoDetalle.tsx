"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { marcarCuotaPagadaAction } from "@/features/cuotas/actions/marcar-cuota-pagada.action";
import { marcarCuotaPendienteAction } from "@/features/cuotas/actions/marcar-cuota-pendiente.action";
import type { MovimientoCuotasDetalleItem } from "@/features/cuotas/types/cuota.types";

import { CuotasDetalleMobileList } from "./CuotasDetalleMobileList";
import { CuotasDetalleProgress } from "./CuotasDetalleProgress";
import { CuotasDetalleTable } from "./CuotasDetalleTable";
import { CuotasResumenCards } from "./CuotasResumenCards";

interface CuotasMovimientoDetalleProps {
    movimiento: MovimientoCuotasDetalleItem;
}

export function CuotasMovimientoDetalle({
    movimiento,
}: CuotasMovimientoDetalleProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleMarcarPagada = (id: string) => {
        setMessage(null);
        setError(null);

        startTransition(async () => {
            const result = await marcarCuotaPagadaAction(id);

            if (!result.success) {
                setError(result.message);
                return;
            }

            setMessage(result.message);
            router.refresh();
        });
    };

    const handleRestaurarPendiente = (id: string) => {
        setMessage(null);
        setError(null);

        startTransition(async () => {
            const result = await marcarCuotaPendienteAction(id);

            if (!result.success) {
                setError(result.message);
                return;
            }

            setMessage(result.message);
            router.refresh();
        });
    };

    return (
        <div className="space-y-5">
            <CuotasResumenCards movimiento={movimiento} />

            <CuotasDetalleProgress movimiento={movimiento} />

            {message ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {message}
                </div>
            ) : null}

            {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {error}
                </div>
            ) : null}

            <CuotasDetalleTable
                cuotas={movimiento.cuotas}
                isPending={isPending}
                onMarcarPagada={handleMarcarPagada}
                onRestaurarPendiente={handleRestaurarPendiente}
            />

            <CuotasDetalleMobileList
                cuotas={movimiento.cuotas}
                isPending={isPending}
                onMarcarPagada={handleMarcarPagada}
                onRestaurarPendiente={handleRestaurarPendiente}
            />
        </div>
    );
}