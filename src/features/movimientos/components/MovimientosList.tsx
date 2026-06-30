"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Pagination } from "@/components/shared/Pagination";
import { deleteMovimientoAction } from "@/features/movimientos/actions/delete-movimiento.action";
import type {
    MovimientoListItem,
    MovimientoPagination,
    MovimientoTipoFilter,
} from "@/features/movimientos/types/movimiento.types";

import { MovimientoMobileCard } from "./MovimientoMobileCard";
import { MovimientosEmptyState } from "./MovimientosEmptyState";
import { MovimientosFilters } from "./MovimientosFilters";
import { MovimientosTable } from "./MovimientosTable";

interface MovimientosListProps {
    movimientos: MovimientoListItem[];
    query?: string;
    tipo?: MovimientoTipoFilter;
    pagination: MovimientoPagination;
}

export function MovimientosList({
    movimientos,
    query = "",
    tipo = "TODOS",
    pagination,
}: MovimientosListProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [movimientoAEliminar, setMovimientoAEliminar] = useState<
        string | null
    >(null);

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

    const handleOpenDeleteDialog = (id: string) => {
        setMessage(null);
        setError(null);
        setMovimientoAEliminar(id);
    };

    const handleCloseDeleteDialog = () => {
        if (isPending) {
            return;
        }

        setMovimientoAEliminar(null);
    };

    const handleConfirmDelete = () => {
        if (!movimientoAEliminar) {
            return;
        }

        const id = movimientoAEliminar;

        setMessage(null);
        setError(null);

        startTransition(async () => {
            const result = await deleteMovimientoAction(id);

            if (!result.success) {
                setMovimientoAEliminar(null);
                setError(result.message);
                return;
            }

            setMovimientoAEliminar(null);
            setMessage(result.message);
            router.refresh();
        });
    };

    return (
        <div className="space-y-5">
            <MovimientosFilters query={query} tipo={tipo} />

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

            {movimientos.length === 0 ? (
                <MovimientosEmptyState />
            ) : (
                <>
                    <div className="rounded-3xl border border-(--app-border) bg-(--app-card) px-5 py-4 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Mostrando{" "}
                            <span className="font-bold text-foreground">
                                {movimientos.length}
                            </span>{" "}
                            de{" "}
                            <span className="font-bold text-foreground">
                                {pagination.totalItems}
                            </span>{" "}
                            movimiento
                            {pagination.totalItems === 1 ? "" : "s"}.
                        </p>
                    </div>

                    <MovimientosTable
                        movimientos={movimientos}
                        isPending={isPending}
                        onDelete={handleOpenDeleteDialog}
                    />

                    <div className="space-y-3 lg:hidden">
                        {movimientos.map((movimiento) => (
                            <MovimientoMobileCard
                                key={movimiento.id}
                                movimiento={movimiento}
                                isPending={isPending}
                                onDelete={handleOpenDeleteDialog}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        basePath="/movimientos"
                        queryParams={{
                            query: query || undefined,
                            tipo: tipo === "TODOS" ? undefined : tipo,
                        }}
                    />
                </>
            )}

            <ConfirmDialog
                open={Boolean(movimientoAEliminar)}
                title="Eliminar movimiento"
                description="Vas a eliminar este movimiento. Esta acción no se puede deshacer."
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