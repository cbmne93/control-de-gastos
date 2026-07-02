import { PageLoading } from "@/components/shared/PageLoading";

export default function MovimientosLoading() {
    return (
        <PageLoading
            title="Cargando movimientos"
            description="Preparando tus ingresos, gastos y filtros."
        />
    );
}