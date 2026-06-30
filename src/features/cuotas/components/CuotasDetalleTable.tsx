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

interface CuotasDetalleTableProps {
    cuotas: CuotaDetalleItem[];
    isPending: boolean;
    onMarcarPagada: (id: string) => void;
    onRestaurarPendiente: (id: string) => void;
}

export function CuotasDetalleTable({
    cuotas,
    isPending,
    onMarcarPagada,
    onRestaurarPendiente,
}: CuotasDetalleTableProps) {
    return (
        <section className="hidden overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) shadow-sm lg:block">
            <table className="w-full text-left text-sm">
                <thead className="bg-(--app-card-soft) text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-5 py-4 font-semibold">Cuota</th>
                        <th className="px-5 py-4 font-semibold">
                            Vencimiento
                        </th>
                        <th className="px-5 py-4 font-semibold">
                            Fecha de pago
                        </th>
                        <th className="px-5 py-4 font-semibold">Estado</th>
                        <th className="px-5 py-4 text-right font-semibold">
                            Monto
                        </th>
                        <th className="px-5 py-4 text-right font-semibold">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-(--app-border)">
                    {cuotas.map((cuota) => (
                        <tr
                            key={cuota.id}
                            className="transition hover:bg-(--app-card-soft)"
                        >
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--app-card-soft) ring-1 ring-(--app-border)">
                                        <CuotaEstadoIcon estado={cuota.estado} />
                                    </div>

                                    <span className="font-semibold text-foreground">
                                        {cuota.numeroCuota} de{" "}
                                        {cuota.totalCuotas}
                                    </span>
                                </div>
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                                {formatFechaCuota(cuota.fechaVencimiento)}
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                                {cuota.fechaPago
                                    ? formatFechaCuota(cuota.fechaPago)
                                    : "-"}
                            </td>

                            <td className="px-5 py-4">
                                <span
                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getEstadoCuotaBadgeClass(
                                        cuota.estado,
                                    )}`}
                                >
                                    {getEstadoCuotaLabel(cuota.estado)}
                                </span>
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-foreground">
                                {formatMontoPYG(cuota.monto)}
                            </td>

                            <td className="px-5 py-4">
                                <div className="flex justify-end">
                                    <CuotaPagoButton
                                        cuotaId={cuota.id}
                                        estado={cuota.estado}
                                        isPending={isPending}
                                        onMarcarPagada={onMarcarPagada}
                                        onRestaurarPendiente={
                                            onRestaurarPendiente
                                        }
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}