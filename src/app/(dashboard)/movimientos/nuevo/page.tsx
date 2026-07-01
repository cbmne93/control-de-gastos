import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";

import { PageHeader } from "@/components/shared";
import { createMovimientoAction } from "@/features/movimientos/actions/create-movimiento.action";
import { getMovimientoFormOptions } from "@/features/movimientos/actions/get-movimiento-form-options.action";
import { MovimientoForm } from "@/features/movimientos/components";

export default async function NuevoMovimientoPage() {
    const { categorias, cuentas } = await getMovimientoFormOptions();

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="hidden sm:block">
                <PageHeader
                    title="Nuevo movimiento"
                    description="Registrá un nuevo ingreso o gasto en tus cuentas."
                    icon={PlusCircle}
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
                action={createMovimientoAction}
                categorias={categorias}
                cuentas={cuentas}
                submitLabel="Guardar movimiento"
            />
        </div>
    );
}