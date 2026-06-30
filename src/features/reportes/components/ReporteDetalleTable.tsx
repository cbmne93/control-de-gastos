import { EmptyState, PageCard } from "@/components/shared";
import {
    formatReporteFecha,
    formatReporteMontoPYG,
} from "@/features/reportes/helpers/reporte-format.helper";
import type { ReporteDetalleItem } from "@/features/reportes/types/reporte.types";

interface ReporteDetalleTableProps {
    items: ReporteDetalleItem[];
}

function getTipoBadgeClass(tipo: ReporteDetalleItem["tipo"]) {
    if (tipo === "INGRESO") {
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    return "border-rose-200 bg-rose-50 text-rose-700";
}

function getTipoLabel(tipo: ReporteDetalleItem["tipo"]) {
    if (tipo === "INGRESO") {
        return "Ingreso";
    }

    return "Gasto";
}

function getOrigenLabel(item: ReporteDetalleItem) {
    if (item.origen === "CUOTA" && item.cuota) {
        return `Cuota ${item.cuota.numeroCuota}/${item.cuota.totalCuotas}`;
    }

    return "Movimiento";
}

function getMontoClass(tipo: ReporteDetalleItem["tipo"]) {
    if (tipo === "INGRESO") {
        return "text-emerald-700";
    }

    return "text-rose-700";
}

function getMontoPrefix(tipo: ReporteDetalleItem["tipo"]) {
    if (tipo === "INGRESO") {
        return "+";
    }

    return "-";
}

export function ReporteDetalleTable({ items }: ReporteDetalleTableProps) {
    return (
        <PageCard>
            <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground">
                    Detalle del período
                </h2>

                <p className="text-sm text-slate-500">
                    Ingresos, gastos directos y cuotas pagadas que componen el
                    reporte mensual.
                </p>
            </div>

            {items.length === 0 ? (
                <EmptyState
                    title="Sin detalle para este período"
                    description="No se encontraron ingresos, gastos pagados ni cuotas pagadas en el mes seleccionado."
                />
            ) : (
                <>
                    <div className="hidden overflow-hidden rounded-2xl border border-(--app-border) lg:block">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-(--app-card-soft) text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Tipo</th>
                                    <th className="px-4 py-3">Descripción</th>
                                    <th className="px-4 py-3">Categoría</th>
                                    <th className="px-4 py-3">Cuenta</th>
                                    <th className="px-4 py-3">Origen</th>
                                    <th className="px-4 py-3 text-right">
                                        Monto
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-(--app-border) bg-(--app-card)">
                                {items.map((item) => (
                                    <tr
                                        key={`${item.origen}-${item.id}`}
                                        className="transition hover:bg-(--app-card-soft)"
                                    >
                                        <td className="px-4 py-4 font-medium text-slate-600">
                                            {formatReporteFecha(item.fecha)}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getTipoBadgeClass(
                                                    item.tipo,
                                                )}`}
                                            >
                                                {getTipoLabel(item.tipo)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="font-semibold text-foreground">
                                                {item.descripcion}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {item.categoria}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {item.cuenta}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {getOrigenLabel(item)}
                                        </td>

                                        <td
                                            className={`px-4 py-4 text-right font-bold ${getMontoClass(
                                                item.tipo,
                                            )}`}
                                        >
                                            {getMontoPrefix(item.tipo)}
                                            {formatReporteMontoPYG(item.monto)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-3 lg:hidden">
                        {items.map((item) => (
                            <article
                                key={`${item.origen}-${item.id}`}
                                className="rounded-2xl border border-(--app-border) bg-(--app-card) p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500">
                                            {formatReporteFecha(item.fecha)}
                                        </p>

                                        <h3 className="mt-1 font-bold text-foreground">
                                            {item.descripcion}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {item.categoria} · {item.cuenta}
                                        </p>
                                    </div>

                                    <span
                                        className={`text-sm font-bold ${getMontoClass(
                                            item.tipo,
                                        )}`}
                                    >
                                        {getMontoPrefix(item.tipo)}
                                        {formatReporteMontoPYG(item.monto)}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span
                                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getTipoBadgeClass(
                                            item.tipo,
                                        )}`}
                                    >
                                        {getTipoLabel(item.tipo)}
                                    </span>

                                    <span className="inline-flex rounded-full border border-(--app-border) bg-(--app-card-soft) px-2.5 py-1 text-xs font-bold text-slate-600">
                                        {getOrigenLabel(item)}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}
        </PageCard>
    );
}