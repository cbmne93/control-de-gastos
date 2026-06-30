import Link from "next/link";
import { ListChecks, Plus } from "lucide-react";

import { PageHeader } from "@/components/shared";
import { DismissibleUrlAlert } from "@/components/shared/DismissibleUrlAlert";
import { getMovimientosPageDataAction } from "@/features/movimientos/actions/get-movimientos-page-data.action";
import { MovimientosList } from "@/features/movimientos/components";

type TipoMovimientoFilter = "TODOS" | "INGRESO" | "GASTO";

interface MovimientosPageProps {
    searchParams: Promise<{
        query?: string;
        tipo?: TipoMovimientoFilter;
        page?: string;
        created?: string;
        updated?: string;
    }>;
}

function getTipoFilter(tipo?: string): TipoMovimientoFilter {
    if (tipo === "INGRESO" || tipo === "GASTO") {
        return tipo;
    }

    return "TODOS";
}

function normalizePage(value?: string) {
    const page = Number(value);

    if (!Number.isInteger(page) || page < 1) {
        return 1;
    }

    return page;
}

function getSuccessMessage(params: Awaited<MovimientosPageProps["searchParams"]>) {
    if (params.created === "1") {
        return "Movimiento creado correctamente.";
    }

    if (params.updated === "1") {
        return "Movimiento actualizado correctamente.";
    }

    return null;
}

export default async function MovimientosPage({
    searchParams,
}: MovimientosPageProps) {
    const params = await searchParams;

    const query = params.query ?? "";
    const tipo = getTipoFilter(params.tipo);
    const currentPage = normalizePage(params.page);
    const successMessage = getSuccessMessage(params);

    const { movimientos, pagination } = await getMovimientosPageDataAction({
        query,
        tipo,
        page: currentPage,
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Movimientos"
                description="Registrá, consultá y administrá tus ingresos y gastos."
                icon={ListChecks}
                action={
                    <Link
                        href="/movimientos/nuevo"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--app-primary) px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo
                    </Link>
                }
            />

            {successMessage ? (
                <DismissibleUrlAlert
                    message={successMessage}
                    paramsToRemove={["created", "updated"]}
                />
            ) : null}

            <MovimientosList
                movimientos={movimientos}
                query={query}
                tipo={tipo}
                pagination={pagination}
            />
        </div>
    );
}