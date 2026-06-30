import { Bell } from "lucide-react";

import { PageHeader } from "@/components/shared";
import { getNotificacionesPageDataAction } from "@/features/notificaciones/actions";
import { NotificacionesList } from "@/features/notificaciones/components";
import { normalizeNotificacionFilter } from "@/features/notificaciones/helpers";

interface NotificacionesPageProps {
    searchParams: Promise<{
        filter?: string;
        page?: string;
    }>;
}

function normalizePage(value?: string) {
    const page = Number(value);

    if (!Number.isInteger(page) || page < 1) {
        return 1;
    }

    return page;
}

export default async function NotificacionesPage({
    searchParams,
}: NotificacionesPageProps) {
    const params = await searchParams;
    const activeFilter = normalizeNotificacionFilter(params.filter);
    const currentPage = normalizePage(params.page);

    const { notificaciones, stats, pagination } =
        await getNotificacionesPageDataAction({
            filter: activeFilter,
            page: currentPage,
        });

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <PageHeader
                title="Notificaciones"
                description="Alertas sobre cuotas vencidas o próximas a vencer."
                icon={Bell}
            />

            <NotificacionesList
                notificaciones={notificaciones}
                activeFilter={activeFilter}
                stats={stats}
                pagination={pagination}
            />
        </div>
    );
}