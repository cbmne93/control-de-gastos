import Link from "next/link";
import { Bell, Plus } from "lucide-react";

interface HeaderActionsProps {
    showQuickNewMovimiento: boolean;
    notificacionesNoLeidas: number;
}

export function HeaderActions({
    showQuickNewMovimiento,
    notificacionesNoLeidas,
}: HeaderActionsProps) {
    return (
        <div className="flex shrink-0 items-center gap-2">
            <Link
                href="/notificaciones"
                title="Notificaciones"
                aria-label={
                    notificacionesNoLeidas > 0
                        ? `${notificacionesNoLeidas} notificaciones sin leer`
                        : "Notificaciones"
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--app-border) bg-(--app-card) text-(--app-primary) shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft)"
            >
                <span className="relative">
                    <Bell className="h-4 w-4" />

                    {notificacionesNoLeidas > 0 ? (
                        <span className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white">
                            {notificacionesNoLeidas}
                        </span>
                    ) : null}
                </span>
            </Link>

            {showQuickNewMovimiento ? (
                <Link
                    href="/movimientos/nuevo"
                    className="inline-flex items-center gap-2 rounded-xl bg-(--app-primary) px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                    <Plus className="h-4 w-4" />

                    <span className="hidden sm:inline">
                        Nuevo movimiento
                    </span>

                    <span className="sm:hidden">Nuevo</span>
                </Link>
            ) : null}
        </div>
    );
}