import { z } from "zod";

export const categoriaSchema = z.object({
    id: z.string().optional(),
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres.")
        .max(60, "El nombre no puede superar 60 caracteres."),
    tipo: z.enum(["INGRESO", "GASTO"], {
        error: "Seleccioná el tipo de categoría.",
    }),
    color: z.string().optional(),
    icono: z.string().optional(),
});

export type CategoriaSchema = z.infer<typeof categoriaSchema>;