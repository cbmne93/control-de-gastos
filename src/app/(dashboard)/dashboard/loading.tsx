import { PageLoading } from "@/components/shared/PageLoading";

export default function DashboardLoading() {
    return (
        <PageLoading
            title="Cargando dashboard"
            description="Preparando el resumen de ingresos, gastos y vencimientos."
        />
    );
}