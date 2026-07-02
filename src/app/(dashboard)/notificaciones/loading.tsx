import { PageLoading } from "@/components/shared/PageLoading";

export default function NotificacionesLoading() {
    return (
        <PageLoading
            title="Cargando notificaciones"
            description="Preparando alertas de cuotas vencidas o próximas a vencer."
        />
    );
}