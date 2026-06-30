import Link from "next/link";
import { Edit, Eye, Trash2 } from "lucide-react";

interface MovimientoActionsProps {
    movimientoId: string;
    tieneCuotas: boolean;
    isPending: boolean;
    onDelete: (id: string) => void;
    mobile?: boolean;
}

export function MovimientoActions({
    movimientoId,
    tieneCuotas,
    isPending,
    onDelete,
    mobile = false,
}: MovimientoActionsProps) {
    if (mobile) {
        return (
            <div
                className={
                    tieneCuotas
                        ? "mt-4 grid gap-2 sm:grid-cols-3"
                        : "mt-4 grid grid-cols-2 gap-2"
                }
            >
                {tieneCuotas ? (
                    <Link
                        href={`/cuotas/${movimientoId}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--app-primary-muted) bg-(--app-primary-soft) px-3 py-2.5 text-sm font-semibold text-(--app-primary) shadow-sm transition hover:opacity-90"
                    >
                        <Eye className="h-4 w-4" />
                        Cuotas
                    </Link>
                ) : null}

                <Link
                    href={`/movimientos/${movimientoId}/editar`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--app-border) bg-(--app-card) px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary)"
                >
                    <Edit className="h-4 w-4" />
                    Editar
                </Link>

                <button
                    type="button"
                    onClick={() => onDelete(movimientoId)}
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-end gap-2">
            {tieneCuotas ? (
                <Link
                    href={`/cuotas/${movimientoId}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--app-primary-muted) bg-(--app-primary-soft) text-(--app-primary) shadow-sm transition hover:opacity-90"
                    title="Ver cuotas"
                >
                    <Eye className="h-4 w-4" />
                </Link>
            ) : null}

            <Link
                href={`/movimientos/${movimientoId}/editar`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--app-border) bg-(--app-card) text-slate-600 shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary)"
                title="Editar"
            >
                <Edit className="h-4 w-4" />
            </Link>

            <button
                type="button"
                onClick={() => onDelete(movimientoId)}
                disabled={isPending}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                title="Eliminar"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}