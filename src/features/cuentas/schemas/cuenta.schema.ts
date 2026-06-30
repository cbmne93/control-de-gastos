import { z } from "zod";

export const cuentaSchema = z.object({
    id: z.string().optional(),
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres.")
        .max(60, "El nombre no puede superar 60 caracteres."),
    tipo: z.enum(
        [
            "EFECTIVO",
            "BANCO",
            "BILLETERA",
            "TARJETA_CREDITO",
            "TARJETA_DEBITO",
            "OTRO",
        ],
        {
            error: "Seleccioná el tipo de cuenta.",
        },
    ),
    saldoInicial: z
        .string()
        .trim()
        .optional()
        .transform((value) => {
            if (!value) {
                return "0";
            }

            return value.replace(/\./g, "").replace(",", ".");
        })
        .refine((value) => !Number.isNaN(Number(value)), {
            message: "Ingresá un saldo válido.",
        }),
});

export type CuentaSchema = z.infer<typeof cuentaSchema>;