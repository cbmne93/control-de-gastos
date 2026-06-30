"use client";

import type { CuotaDetalleItem } from "@/features/cuotas/types/cuota.types";

import { CuotaDetalleMobileCard } from "./CuotaDetalleMobileCard";

interface CuotasDetalleMobileListProps {
    cuotas: CuotaDetalleItem[];
    isPending: boolean;
    onMarcarPagada: (id: string) => void;
    onRestaurarPendiente: (id: string) => void;
}

export function CuotasDetalleMobileList({
    cuotas,
    isPending,
    onMarcarPagada,
    onRestaurarPendiente,
}: CuotasDetalleMobileListProps) {
    return (
        <section className="space-y-3 lg:hidden">
            {cuotas.map((cuota) => (
                <CuotaDetalleMobileCard
                    key={cuota.id}
                    cuota={cuota}
                    isPending={isPending}
                    onMarcarPagada={onMarcarPagada}
                    onRestaurarPendiente={onRestaurarPendiente}
                />
            ))}
        </section>
    );
}