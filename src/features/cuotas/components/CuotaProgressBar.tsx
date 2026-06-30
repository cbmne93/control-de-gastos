import { getCuotasProgressPercent } from "@/features/cuotas/helpers/cuota-format.helper";

interface CuotaProgressBarProps {
    pagadas: number;
    total: number;
}

export function CuotaProgressBar({ pagadas, total }: CuotaProgressBarProps) {
    const progress = getCuotasProgressPercent(pagadas, total);

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-600">
                    Progreso de pago
                </span>

                <span className="font-bold text-foreground">
                    {pagadas} de {total}
                </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-(--app-card-soft) ring-1 ring-(--app-border)">
                <div
                    className="h-full rounded-full bg-(--app-primary) transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}