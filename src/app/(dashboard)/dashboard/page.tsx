import { PageHeader } from "@/components/shared";
import { getDashboardDataAction } from "@/features/dashboard/actions/get-dashboard-data.action";
import {
    DashboardStats,
    EstadoRapido,
    ProximosVencimientos,
    UltimosRegistros,
} from "@/features/dashboard/components";

export default async function DashboardPage() {
    const data = await getDashboardDataAction();

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <PageHeader
                title="Dashboard"
                description="Controlá tus ingresos, gastos pagados, cuotas pendientes, vencimientos y notificaciones desde un solo lugar."
            />

            <DashboardStats data={data} />

            <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                <ProximosVencimientos
                    vencimientos={data.proximosVencimientos}
                />

                <EstadoRapido data={data} />
            </section>

            <UltimosRegistros registros={data.ultimosRegistros} />
        </div>
    );
}