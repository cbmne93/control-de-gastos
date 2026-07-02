import Link from "next/link";
import { FileSpreadsheet, Filter } from "lucide-react";

import { getCurrentPeriodo } from "@/features/reportes/helpers/reporte-date.helper";
import type { ReportePeriodo } from "@/features/reportes/types/reporte.types";

interface ReporteFiltrosProps {
    periodo: ReportePeriodo;
}

const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
];

function getYearOptions(currentYear: number) {
    return Array.from({ length: 7 }, (_, index) => currentYear - 3 + index);
}

export function ReporteFiltros({ periodo }: ReporteFiltrosProps) {
    const currentPeriodo = getCurrentPeriodo();
    const years = getYearOptions(currentPeriodo.year);
    const exportHref = `/reportes/exportar-excel?month=${periodo.month}&year=${periodo.year}`;

    return (
        <form
            action="/reportes"
            className="rounded-3xl border border-(--app-border) bg-(--app-card) p-4 shadow-sm sm:p-5"
        >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                        <Filter className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-foreground">
                            Filtros del reporte
                        </h2>

                        <p className="hidden text-sm text-slate-500 sm:block">
                            Seleccioná el mes y año que querés analizar.
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[180px_140px_140px_170px] sm:items-end">
                    <div>
                        <label
                            htmlFor="month"
                            className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                            Mes
                        </label>

                        <select
                            id="month"
                            name="month"
                            defaultValue={periodo.month}
                            className="h-11 w-full rounded-xl border border-(--app-border) bg-(--app-card) px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)"
                        >
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="year"
                            className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                            Año
                        </label>

                        <select
                            id="year"
                            name="year"
                            defaultValue={periodo.year}
                            className="h-11 w-full rounded-xl border border-(--app-border) bg-(--app-card) px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-(--app-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                    >
                        Ver detalle
                    </button>

                    <Link
                        href={exportHref}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-100"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        Exportar Excel
                    </Link>
                </div>
            </div>
        </form>
    );
}