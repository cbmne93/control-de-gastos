import Link from "next/link";

import type {
    NotificacionFilterValue,
    NotificacionesStats,
} from "@/features/notificaciones/types/notificacion.types";

interface NotificacionesFiltersProps {
    activeFilter: NotificacionFilterValue;
    stats: NotificacionesStats;
}

const filters: {
    label: string;
    value: NotificacionFilterValue;
    countKey: keyof NotificacionesStats;
}[] = [
        { label: "Todas", value: "TODAS", countKey: "todas" },
        { label: "Sin leer", value: "SIN_LEER", countKey: "sinLeer" },
        { label: "Leídas", value: "LEIDAS", countKey: "leidas" },
        { label: "Vencidas", value: "CUOTA_VENCIDA", countKey: "cuotaVencida" },
        {
            label: "Por vencer",
            value: "CUOTA_POR_VENCER",
            countKey: "cuotaPorVencer",
        },
    ];

function getFilterHref(value: NotificacionFilterValue) {
    if (value === "TODAS") {
        return "/notificaciones";
    }

    return `/notificaciones?filter=${value}`;
}

export function NotificacionesFilters({
    activeFilter,
    stats,
}: NotificacionesFiltersProps) {
    return (
        <div className="rounded-3xl border border-(--app-border) bg-(--app-card) p-2 shadow-sm sm:p-4">
            <div className="overflow-x-auto">
                <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
                    {filters.map((filter) => {
                        const isActive = activeFilter === filter.value;
                        const count = stats[filter.countKey];

                        return (
                            <Link
                                key={filter.value}
                                href={getFilterHref(filter.value)}
                                className={[
                                    "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-bold transition sm:h-10 sm:gap-2 sm:px-4 sm:text-sm",
                                    isActive
                                        ? "bg-(--app-primary) text-white shadow-sm"
                                        : "border border-(--app-border) bg-(--app-card) text-slate-700 hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary)",
                                ].join(" ")}
                            >
                                <span>{filter.label}</span>

                                <span
                                    className={[
                                        "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold sm:min-w-6 sm:px-2 sm:text-xs",
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-(--app-card-soft) text-slate-600",
                                    ].join(" ")}
                                >
                                    {count}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}