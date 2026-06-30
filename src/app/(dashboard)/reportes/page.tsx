import { PageHeader } from "@/components/shared";
import { getReporteMensualAction } from "@/features/reportes/actions";
import {
    getReporteTitle,
    normalizeReportePeriodo,
} from "@/features/reportes/helpers";
import {
    ReporteConteos,
    ReporteDetalleTable,
    ReporteFiltros,
    ReporteResumen,
    ReporteResumenTable,
} from "@/features/reportes/components";

interface ReportesPageProps {
    searchParams: Promise<{
        month?: string;
        year?: string;
    }>;
}

export default async function ReportesPage({ searchParams }: ReportesPageProps) {
    const params = await searchParams;
    const periodo = normalizeReportePeriodo(params.month, params.year);
    const data = await getReporteMensualAction(periodo);
    const reporteTitle = getReporteTitle(data.periodo);

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <PageHeader
                title="Reportes"
                description={`Resumen financiero de ${reporteTitle}. Incluye ingresos, gastos pagados, cuotas y compromisos pendientes.`}
            />

            <ReporteFiltros periodo={data.periodo} />

            <ReporteResumen data={data} />

            <ReporteConteos data={data} />

            <ReporteDetalleTable items={data.detalle} />

            <section className="grid gap-4 xl:grid-cols-2">
                <ReporteResumenTable
                    title="Resumen por categoría"
                    description="Ingresos y gastos agrupados según la categoría del movimiento."
                    emptyTitle="Sin movimientos por categoría"
                    emptyDescription="No se encontraron ingresos ni gastos pagados para este período."
                    items={data.categorias}
                />

                <ReporteResumenTable
                    title="Resumen por cuenta"
                    description="Ingresos y gastos agrupados según la cuenta utilizada."
                    emptyTitle="Sin movimientos por cuenta"
                    emptyDescription="No se encontraron movimientos asociados a cuentas para este período."
                    items={data.cuentas}
                />
            </section>
        </div>
    );
}