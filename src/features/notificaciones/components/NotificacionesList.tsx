"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
    Bell,
    CalendarClock,
    CheckCheck,
    CheckCircle2,
    Eye,
    Sparkles,
    Trash2,
} from "lucide-react";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Pagination } from "@/components/shared/Pagination";
import {
    deleteNotificacionAction,
    limpiarNotificacionesDuplicadasAction,
    marcarNotificacionLeidaAction,
    marcarTodasNotificacionesLeidasAction,
} from "@/features/notificaciones/actions";
import {
    formatFechaVencimiento,
    formatNotificacionFecha,
    getTipoNotificacionBadgeClass,
    getTipoNotificacionLabel,
} from "@/features/notificaciones/helpers";
import type {
    NotificacionFilterValue,
    NotificacionListItem,
    NotificacionesPagination,
    NotificacionesStats,
} from "@/features/notificaciones/types/notificacion.types";

import { NotificacionesFilters } from "./NotificacionesFilters";

interface NotificacionesListProps {
    notificaciones: NotificacionListItem[];
    activeFilter: NotificacionFilterValue;
    stats: NotificacionesStats;
    pagination: NotificacionesPagination;
}

interface NotificacionAEliminar {
    id: string;
    titulo: string;
}

function getEmptyDescription(activeFilter: NotificacionFilterValue) {
    if (activeFilter === "SIN_LEER") {
        return "No tenés notificaciones pendientes de lectura.";
    }

    if (activeFilter === "LEIDAS") {
        return "Todavía no hay notificaciones marcadas como leídas.";
    }

    if (activeFilter === "CUOTA_VENCIDA") {
        return "No hay alertas de cuotas vencidas.";
    }

    if (activeFilter === "CUOTA_POR_VENCER") {
        return "No hay alertas de cuotas próximas a vencer.";
    }

    return "Cuando tengas cuotas vencidas o próximas a vencer, van a aparecer en esta sección.";
}

export function NotificacionesList({
    notificaciones,
    activeFilter,
    stats,
    pagination,
}: NotificacionesListProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notificacionAEliminar, setNotificacionAEliminar] =
        useState<NotificacionAEliminar | null>(null);

    const unreadCount = useMemo(() => {
        return notificaciones.filter((notificacion) => !notificacion.leida)
            .length;
    }, [notificaciones]);

    useEffect(() => {
        if (!message) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setMessage(null);
        }, 3500);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [message]);

    const handleMarkAsRead = (id: string) => {
        setMessage(null);
        setError(null);

        startTransition(async () => {
            const result = await marcarNotificacionLeidaAction(id);

            if (!result.success) {
                setError(result.message);
                return;
            }

            setMessage(result.message);
            router.refresh();
        });
    };

    const handleMarkAllAsRead = () => {
        setMessage(null);
        setError(null);

        startTransition(async () => {
            const result = await marcarTodasNotificacionesLeidasAction({
                filter: activeFilter,
            });

            if (!result.success) {
                setError(result.message);
                return;
            }

            setMessage(result.message);
            router.refresh();
        });
    };

    const handleCleanDuplicates = () => {
        setMessage(null);
        setError(null);

        startTransition(async () => {
            const result = await limpiarNotificacionesDuplicadasAction();

            if (!result.success) {
                setError(result.message);
                return;
            }

            setMessage(result.message);
            router.refresh();
        });
    };

    const handleOpenDeleteDialog = (notificacion: NotificacionListItem) => {
        setMessage(null);
        setError(null);
        setNotificacionAEliminar({
            id: notificacion.id,
            titulo: notificacion.titulo,
        });
    };

    const handleCloseDeleteDialog = () => {
        if (isPending) {
            return;
        }

        setNotificacionAEliminar(null);
    };

    const handleConfirmDelete = () => {
        if (!notificacionAEliminar) {
            return;
        }

        const id = notificacionAEliminar.id;

        setMessage(null);
        setError(null);

        startTransition(async () => {
            const result = await deleteNotificacionAction(id);

            if (!result.success) {
                setError(result.message);
                return;
            }

            setNotificacionAEliminar(null);
            setMessage(result.message);
            router.refresh();
        });
    };

    return (
        <div className="space-y-5">
            <NotificacionesFilters activeFilter={activeFilter} stats={stats} />

            {notificaciones.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-(--app-border) bg-(--app-card-soft) px-6 py-12 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                        <Bell className="h-5 w-5" />
                    </div>

                    <h2 className="mt-4 text-base font-semibold text-foreground">
                        No hay notificaciones
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {getEmptyDescription(activeFilter)}
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-3 rounded-3xl border border-(--app-border) bg-(--app-card) p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-foreground">
                                Bandeja de notificaciones
                            </h2>

                            <p className="text-sm text-slate-500">
                                Mostrando{" "}
                                <span className="font-bold text-foreground">
                                    {notificaciones.length}
                                </span>{" "}
                                de{" "}
                                <span className="font-bold text-foreground">
                                    {pagination.totalItems}
                                </span>{" "}
                                notificación
                                {pagination.totalItems === 1 ? "" : "es"} en
                                este filtro. Sin leer en esta página:{" "}
                                <span className="font-bold text-foreground">
                                    {unreadCount}
                                </span>
                                .
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                            <button
                                type="button"
                                onClick={handleCleanDuplicates}
                                disabled={isPending}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-(--app-border) bg-(--app-card) px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary) disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Sparkles className="h-4 w-4" />
                                Limpiar duplicadas
                            </button>

                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                disabled={isPending || stats.sinLeer === 0}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-(--app-border) bg-(--app-card) px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary) disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <CheckCheck className="h-4 w-4" />
                                Marcar todas como leídas
                            </button>
                        </div>
                    </div>

                    {message ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            {message}
                        </div>
                    ) : null}

                    {error ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                            {error}
                        </div>
                    ) : null}

                    <div className="space-y-3">
                        {notificaciones.map((notificacion) => (
                            <article
                                key={notificacion.id}
                                className={[
                                    "rounded-3xl border p-5 shadow-sm transition",
                                    notificacion.leida
                                        ? "border-(--app-border) bg-(--app-card)"
                                        : "border-(--app-primary-muted) bg-(--app-primary-soft)",
                                ].join(" ")}
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div
                                            className={[
                                                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1",
                                                notificacion.tipo ===
                                                    "CUOTA_VENCIDA"
                                                    ? "bg-rose-50 text-rose-700 ring-rose-100"
                                                    : "bg-amber-50 text-amber-700 ring-amber-100",
                                            ].join(" ")}
                                        >
                                            <CalendarClock className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-bold text-foreground">
                                                    {notificacion.titulo}
                                                </h3>

                                                {!notificacion.leida ? (
                                                    <span className="rounded-full bg-(--app-primary) px-2 py-0.5 text-xs font-bold text-white">
                                                        Nueva
                                                    </span>
                                                ) : null}
                                            </div>

                                            <p className="mt-1 text-sm text-slate-600">
                                                {notificacion.mensaje}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getTipoNotificacionBadgeClass(
                                                        notificacion.tipo,
                                                    )}`}
                                                >
                                                    {getTipoNotificacionLabel(
                                                        notificacion.tipo,
                                                    )}
                                                </span>

                                                <span className="inline-flex rounded-full border border-(--app-border) bg-(--app-card) px-2.5 py-1 text-xs font-bold text-slate-600">
                                                    {formatNotificacionFecha(
                                                        notificacion.createdAt,
                                                    )}
                                                </span>

                                                {notificacion.cuota ? (
                                                    <span className="inline-flex rounded-full border border-(--app-border) bg-(--app-card) px-2.5 py-1 text-xs font-bold text-slate-600">
                                                        Vence:{" "}
                                                        {formatFechaVencimiento(
                                                            notificacion.cuota
                                                                .fechaVencimiento,
                                                        )}
                                                    </span>
                                                ) : null}
                                            </div>

                                            {notificacion.cuota ? (
                                                <p className="mt-3 text-sm font-medium text-slate-500">
                                                    {
                                                        notificacion.cuota
                                                            .movimiento
                                                            .descripcion
                                                    }{" "}
                                                    · Cuota{" "}
                                                    {
                                                        notificacion.cuota
                                                            .numeroCuota
                                                    }{" "}
                                                    de{" "}
                                                    {
                                                        notificacion.cuota
                                                            .totalCuotas
                                                    }
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-end gap-2">
                                        {notificacion.cuota ? (
                                            <Link
                                                href={`/cuotas/${notificacion.cuota.movimiento.id}`}
                                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-(--app-primary-muted) bg-(--app-card) px-3 text-sm font-bold text-(--app-primary) shadow-sm transition hover:bg-(--app-primary-soft)"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver cuota
                                            </Link>
                                        ) : null}

                                        {!notificacion.leida ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notificacion.id,
                                                    )
                                                }
                                                disabled={isPending}
                                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                Leída
                                            </button>
                                        ) : null}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleOpenDeleteDialog(
                                                    notificacion,
                                                )
                                            }
                                            disabled={isPending}
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 text-sm font-bold text-rose-700 shadow-sm transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        basePath="/notificaciones"
                        queryParams={{
                            filter:
                                activeFilter === "TODAS"
                                    ? undefined
                                    : activeFilter,
                        }}
                    />
                </>
            )}

            <ConfirmDialog
                open={Boolean(notificacionAEliminar)}
                title="Eliminar notificación"
                description={`Vas a eliminar "${notificacionAEliminar?.titulo ?? "esta notificación"}". Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                variant="danger"
                isLoading={isPending}
                onCancel={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}