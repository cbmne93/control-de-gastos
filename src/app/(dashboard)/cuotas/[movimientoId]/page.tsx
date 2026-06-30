import Link from "next/link";
import { ArrowLeft, CalendarClock, PencilLine } from "lucide-react";

import { PageHeader } from "@/components/shared";
import { getMovimientoCuotasDetailAction } from "@/features/cuotas/actions/get-movimiento-cuotas-detail.action";
import { CuotasMovimientoDetalle } from "@/features/cuotas/components";

interface CuotasMovimientoPageProps {
    params: Promise<{
        movimientoId: string;
    }>;
}

export default async function CuotasMovimientoPage({
    params,
}: CuotasMovimientoPageProps) {
    const { movimientoId } = await params;

    const movimiento = await getMovimientoCuotasDetailAction(movimientoId);

    return (
        <div className="space-y-6">
            <PageHeader
                title={movimiento.descripcion}
                description={`${movimiento.categoria.nombre} · ${movimiento.cuenta.nombre}`}
                icon={CalendarClock}
                action={
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Link
                            href="/cuotas"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--app-border) bg-(--app-card) px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary)"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Link>

                        <Link
                            href={`/movimientos/${movimiento.id}/editar`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--app-primary-muted) bg-(--app-primary-soft) px-4 py-2.5 text-sm font-semibold text-(--app-primary) shadow-sm transition hover:opacity-90"
                        >
                            <PencilLine className="h-4 w-4" />
                            Editar gasto
                        </Link>
                    </div>
                }
            />

            <CuotasMovimientoDetalle movimiento={movimiento} />
        </div>
    );
}