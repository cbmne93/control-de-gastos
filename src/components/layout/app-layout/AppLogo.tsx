import { WalletCards } from "lucide-react";

export function AppLogo() {
    return (
        <div className="flex h-20 items-center gap-3 border-b border-(--app-border) px-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--app-primary) text-white shadow-sm ring-1 ring-(--app-primary-muted)">
                <WalletCards className="h-6 w-6" />
            </div>

            <div className="min-w-0">
                <p className="truncate text-base font-bold leading-tight text-foreground">
                    Control de gastos
                </p>

                <p className="truncate text-xs font-medium text-slate-500">
                    Finanzas personales
                </p>
            </div>
        </div>
    );
}