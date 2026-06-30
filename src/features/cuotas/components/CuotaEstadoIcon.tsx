import { CalendarClock, CheckCircle2, Clock } from "lucide-react";

import type { EstadoCuotaValue } from "@/features/cuotas/types/cuota.types";

interface CuotaEstadoIconProps {
    estado: EstadoCuotaValue;
}

export function CuotaEstadoIcon({ estado }: CuotaEstadoIconProps) {
    if (estado === "PAGADA") {
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    }

    if (estado === "VENCIDA") {
        return <CalendarClock className="h-4 w-4 text-rose-600" />;
    }

    return <Clock className="h-4 w-4 text-amber-600" />;
}