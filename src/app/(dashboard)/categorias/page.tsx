import { Tags } from "lucide-react";

import { DismissibleUrlAlert, PageCard, PageHeader } from "@/components/shared";
import {
    CategoriaForm,
    CategoriasList,
} from "@/features/categorias/components";
import { getCategoriaByIdAction } from "@/features/categorias/actions/get-categorias.action";
import { getCategoriasPageDataAction } from "@/features/categorias/actions/get-categorias-page-data.action";

type CategoriasPageProps = {
    searchParams: Promise<{
        edit?: string;
        success?: string;
        page?: string;
    }>;
};

function getSuccessMessage(success?: string) {
    if (success === "categoria-creada") {
        return "¡Listo! Categoría creada correctamente.";
    }

    if (success === "categoria-actualizada") {
        return "¡Listo! Categoría actualizada correctamente.";
    }

    return null;
}

function normalizePage(value?: string) {
    const page = Number(value);

    if (!Number.isInteger(page) || page < 1) {
        return 1;
    }

    return page;
}

export default async function CategoriasPage({
    searchParams,
}: CategoriasPageProps) {
    const params = await searchParams;
    const successMessage = getSuccessMessage(params.success);
    const currentPage = normalizePage(params.page);

    const [{ categorias, pagination }, categoriaEditando] = await Promise.all([
        getCategoriasPageDataAction({
            page: currentPage,
        }),
        getCategoriaByIdAction(params.edit),
    ]);

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <PageHeader
                title="Categorías"
                description="Organizá tus ingresos y gastos por categorías para tener mejores reportes y control mensual."
                icon={Tags}
            />

            {successMessage ? (
                <DismissibleUrlAlert
                    message={successMessage}
                    paramsToRemove={["success"]}
                />
            ) : null}

            <PageCard>
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-foreground">
                        {categoriaEditando
                            ? "Editar categoría"
                            : "Nueva categoría"}
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                        Las categorías ayudan a clasificar movimientos como
                        alimentación, salario, transporte, servicios o deudas.
                    </p>
                </div>

                <CategoriaForm
                    key={categoriaEditando?.id ?? "nueva-categoria"}
                    categoria={categoriaEditando}
                />
            </PageCard>

            <PageCard>
                <div className="mb-5">
                    <h2 className="text-lg font-bold text-foreground">
                        Categorías registradas
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Podés editar, activar o desactivar categorías sin perder
                        el historial de movimientos.
                    </p>
                </div>

                <CategoriasList
                    categorias={categorias}
                    pagination={pagination}
                />
            </PageCard>
        </div>
    );
}