import { CalendarClock } from "lucide-react";

import { PageHeader } from "@/components/shared";
import { getMovimientosConCuotasAction } from "@/features/cuotas/actions/get-movimientos-con-cuotas.action";
import { MovimientosCuotasList } from "@/features/cuotas/components";

type EstadoCuotaFilter = "TODOS" | "PENDIENTE" | "PAGADA" | "VENCIDA";

interface CuotasPageProps {
    searchParams: Promise<{
        query?: string;
        estado?: EstadoCuotaFilter;
    }>;
}

function getEstadoFilter(estado?: string): EstadoCuotaFilter {
    if (
        estado === "PENDIENTE" ||
        estado === "PAGADA" ||
        estado === "VENCIDA"
    ) {
        return estado;
    }

    return "TODOS";
}

export default async function CuotasPage({ searchParams }: CuotasPageProps) {
    const params = await searchParams;

    const query = params.query ?? "";
    const estado = getEstadoFilter(params.estado);

    const movimientos = await getMovimientosConCuotasAction({
        query,
        estado,
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Cuotas / Vencimientos"
                description="Consultá tus gastos en cuotas, próximos vencimientos y pagos pendientes."
                icon={CalendarClock}
            />

            <MovimientosCuotasList
                movimientos={movimientos}
                query={query}
                estado={estado}
            />
        </div>
    );
}