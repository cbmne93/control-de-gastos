import Link from "next/link";
import { ArrowLeft, PencilLine } from "lucide-react";

import { PageHeader } from "@/components/shared";
import { getMovimientoByIdAction } from "@/features/movimientos/actions/get-movimiento-by-id.action";
import { getMovimientoFormOptions } from "@/features/movimientos/actions/get-movimiento-form-options.action";
import { updateMovimientoAction } from "@/features/movimientos/actions/update-movimiento.action";
import { MovimientoForm } from "@/features/movimientos/components";

interface EditarMovimientoPageProps {
    params: Promise<{
        id: string;
    }>;
}

function formatDateForInput(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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
        movimiento.id,
    );

    return (
        <div className="space-y-6">
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

            <MovimientoForm
                action={updateMovimientoWithId}
                categorias={options.categorias}
                cuentas={options.cuentas}
                submitLabel="Actualizar movimiento"
                defaultValues={{
                    tipo: movimiento.tipo,
                    descripcion: movimiento.descripcion,
                    monto: formatMontoForInput(movimiento.monto),
                    fecha: formatDateForInput(movimiento.fecha),
                    categoriaId: movimiento.categoriaId,
                    cuentaId: movimiento.cuentaId,
                    tieneCuotas: movimiento.tieneCuotas,
                    cantidadCuotas: movimiento.cantidadCuotas
                        ? movimiento.cantidadCuotas.toString()
                        : "2",
                    fechaPrimerVencimiento:
                        movimiento.fechaPrimerVencimiento
                            ? formatDateForInput(
                                movimiento.fechaPrimerVencimiento,
                            )
                            : "",
                }}
            />
        </div>
    );
}