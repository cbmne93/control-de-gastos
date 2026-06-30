import { z } from "zod";

const montoSchema = z
    .string()
    .trim()
    .min(1, "El monto es obligatorio.")
    .refine((value) => {
        const normalizedValue = value.replace(/\./g, "").replace(",", ".");
        const numberValue = Number(normalizedValue);

        return !Number.isNaN(numberValue) && numberValue > 0;
    }, "El monto debe ser mayor a 0.");

const optionalFormString = z.preprocess((value) => {
    if (value === null || value === undefined) {
        return undefined;
    }

    if (typeof value === "string" && value.trim() === "") {
        return undefined;
    }

    return value;
}, z.string().optional());

export const movimientoSchema = z
    .object({
        tipo: z.enum(["INGRESO", "GASTO"], {
            message: "Seleccioná el tipo de movimiento.",
        }),
        descripcion: z
            .string()
            .trim()
            .min(2, "La descripción es obligatoria.")
            .max(120, "La descripción no puede superar 120 caracteres."),
        monto: montoSchema,
        fecha: z.string().min(1, "La fecha es obligatoria."),
        categoriaId: z.string().min(1, "Seleccioná una categoría."),
        cuentaId: z.string().min(1, "Seleccioná una cuenta."),
        tieneCuotas: z.boolean().default(false),
        cantidadCuotas: optionalFormString,
        fechaPrimerVencimiento: optionalFormString,
    })
    .superRefine((data, ctx) => {
        if (data.tipo !== "GASTO" || !data.tieneCuotas) {
            return;
        }

        const cantidadCuotas = Number(data.cantidadCuotas);

        if (
            !data.cantidadCuotas ||
            Number.isNaN(cantidadCuotas) ||
            cantidadCuotas < 2
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["cantidadCuotas"],
                message: "La cantidad de cuotas debe ser mayor o igual a 2.",
            });
        }

        if (!data.fechaPrimerVencimiento) {
            ctx.addIssue({
                code: "custom",
                path: ["fechaPrimerVencimiento"],
                message: "La fecha del primer vencimiento es obligatoria.",
            });
        }
    });

export type MovimientoSchema = z.infer<typeof movimientoSchema>;