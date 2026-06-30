import { type TipoMovimiento } from "@/generated/prisma/client";

export type CategoriaListItem = {
    id: string;
    nombre: string;
    tipo: TipoMovimiento;
    color: string | null;
    icono: string | null;
    activo: boolean;
    createdAt: Date;
    movimientosCount: number;
};

export interface CategoriaPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
}