import { z } from "zod";

export const aparienciaSchema = z.object({
    temaPreferido: z.enum(["CLARO", "OSCURO", "SISTEMA"]),
    colorPrincipal: z.enum(["TEAL", "SKY", "INDIGO", "EMERALD"]),
});

export type AparienciaSchema = z.infer<typeof aparienciaSchema>;