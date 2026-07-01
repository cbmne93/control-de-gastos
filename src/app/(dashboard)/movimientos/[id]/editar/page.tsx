import Link from "next/link";
import { ArrowLeft, PencilLine } from "lucide-react";

import { PageHeader } from "@/components/shared";
import { toDateInputValue } from "@/lib/date/date-only";
import { getMovimientoByIdAction } from "@/features/movimientos/actions/get-movimiento-by-id.action";
import { getMovimientoFormOptions } from "@/features/movimientos/actions/get-movimiento-form-options.action";
import { updateMovimientoAction } from "@/features/movimientos/actions/update-movimiento.action";
import { MovimientoForm } from "@/features/movimientos/components";

interface EditarMovimientoPageProps {
    params: Promise<{
        id: string;
    }>;
}

function formatMontoForInput(value: number) {
    return new Intl.NumberFormat("es-PY", {
        maximumFractionDigits: 0,
    }).format(value);
}

export default async function EditarMovimientoPage({
    params,
}: EditarMovimientoPageProps) {
    const { id } = await params;

    const [movimiento, options] = await Promise.all([
        getMovimientoByIdAction(id),
        getMovimientoFormOptions(),
    ]);

    const updateMovimientoWithId = updateMovimientoAction.bind(
        null,
        movimiento.id
    );

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="hidden sm:block">
                <PageHeader
                    title="Editar movimiento"
                    description="Actualizá los datos del ingreso o gasto registrado."
                    icon={PencilLine}
                    action={
                        <Link
                            href="/movimientos"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--app-border) bg-(--app-card) px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary)"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Link>
                    }
                />
            </div>

            <MovimientoForm
                action={updateMovimientoWithId}
                categorias={options.categorias}
                cuentas={options.cuentas}
                submitLabel="Actualizar movimiento"
                defaultValues={{
                    tipo: movimiento.tipo,
                    descripcion: movimiento.descripcion,
                    monto: formatMontoForInput(movimiento.monto),
                    fecha: toDateInputValue(movimiento.fecha),
                    categoriaId: movimiento.categoriaId,
                    cuentaId: movimiento.cuentaId,
                    tieneCuotas: movimiento.tieneCuotas,
                    cantidadCuotas: movimiento.cantidadCuotas
                        ? movimiento.cantidadCuotas.toString()
                        : "2",
                    fechaPrimerVencimiento:
                        movimiento.fechaPrimerVencimiento
                            ? toDateInputValue(
                                movimiento.fechaPrimerVencimiento
                            )
                            : "",
                }}
            />
        </div>
    );
}