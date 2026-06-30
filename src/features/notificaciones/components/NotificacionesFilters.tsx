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
        <div className="rounded-3xl border border-(--app-border) bg-(--app-card) p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                    const isActive = activeFilter === filter.value;
                    const count = stats[filter.countKey];

                    return (
                        <Link
                            key={filter.value}
                            href={getFilterHref(filter.value)}
                            className={[
                                "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition",
                                isActive
                                    ? "bg-(--app-primary) text-white shadow-sm"
                                    : "border border-(--app-border) bg-(--app-card) text-slate-700 hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary)",
                            ].join(" ")}
                        >
                            <span>{filter.label}</span>

                            <span
                                className={[
                                    "inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold",
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
    );
}