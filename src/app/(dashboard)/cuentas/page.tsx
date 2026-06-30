import { Wallet } from "lucide-react";

import { DismissibleUrlAlert, PageCard, PageHeader } from "@/components/shared";
import { CuentaForm, CuentasList } from "@/features/cuentas/components";
import { getCuentaByIdAction } from "@/features/cuentas/actions/get-cuentas.action";
import { getCuentasPageDataAction } from "@/features/cuentas/actions/get-cuentas-page-data.action";

type CuentasPageProps = {
    searchParams: Promise<{
        edit?: string;
        success?: string;
        page?: string;
    }>;
};

function getSuccessMessage(success?: string) {
    if (success === "cuenta-creada") {
        return "¡Excelente! Cuenta creada correctamente.";
    }

    if (success === "cuenta-actualizada") {
        return "¡Excelente! Cuenta actualizada correctamente.";
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

export default async function CuentasPage({ searchParams }: CuentasPageProps) {
    const params = await searchParams;
    const successMessage = getSuccessMessage(params.success);
    const currentPage = normalizePage(params.page);

    const [{ cuentas, pagination }, cuentaEditando] = await Promise.all([
        getCuentasPageDataAction({
            page: currentPage,
        }),
        getCuentaByIdAction(params.edit),
    ]);

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <PageHeader
                title="Cuentas"
                description="Administrá efectivo, bancos, billeteras y tarjetas para controlar de dónde entra o sale tu dinero."
                icon={Wallet}
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
                        {cuentaEditando ? "Editar cuenta" : "Nueva cuenta"}
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                        Las cuentas ayudan a separar el dinero disponible en
                        efectivo, bancos, billeteras o tarjetas.
                    </p>
                </div>

                <CuentaForm
                    key={cuentaEditando?.id ?? "nueva-cuenta"}
                    cuenta={cuentaEditando}
                />
            </PageCard>

            <PageCard>
                <div className="mb-5">
                    <h2 className="text-lg font-bold text-foreground">
                        Cuentas registradas
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Podés editar, activar o desactivar cuentas sin perder el
                        historial de movimientos.
                    </p>
                </div>

                <CuentasList cuentas={cuentas} pagination={pagination} />
            </PageCard>
        </div>
    );
}