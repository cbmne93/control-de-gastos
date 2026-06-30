import Link from "next/link";
import { Plus, ReceiptText } from "lucide-react";

export function MovimientosEmptyState() {
    return (
        <div className="rounded-3xl border border-dashed border-(--app-border) bg-(--app-card-soft) px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                <ReceiptText className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-foreground">
                No hay movimientos
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Registrá tu primer ingreso o gasto para empezar a controlar tus
                finanzas.
            </p>

            <Link
                href="/movimientos/nuevo"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-(--app-primary) px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
                <Plus className="h-4 w-4" />
                Nuevo movimiento
            </Link>
        </div>
    );
}