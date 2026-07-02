import { PageLoading } from "@/components/shared/PageLoading";

export default function CuentasLoading() {
    return (
        <PageLoading
            title="Cargando cuentas"
            description="Preparando saldos, cuentas y movimientos vinculados."
        />
    );
}