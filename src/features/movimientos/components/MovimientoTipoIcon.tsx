import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import type { TipoMovimientoValue } from "@/features/movimientos/types/movimiento.types";

interface MovimientoTipoIconProps {
    tipo: TipoMovimientoValue;
}

export function MovimientoTipoIcon({ tipo }: MovimientoTipoIconProps) {
    if (tipo === "INGRESO") {
        return <ArrowUpCircle className="h-4 w-4 text-emerald-600" />;
    }

    return <ArrowDownCircle className="h-4 w-4 text-rose-600" />;
}