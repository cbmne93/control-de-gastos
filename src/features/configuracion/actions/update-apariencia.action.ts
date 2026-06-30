"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { aparienciaSchema } from "@/features/configuracion/schemas";

export interface UpdateAparienciaState {
    ok: boolean;
    message: string;
    errors?: {
        temaPreferido?: string[];
        colorPrincipal?: string[];
    };
}

export async function updateAparienciaAction(
    _prevState: UpdateAparienciaState,
    formData: FormData,
): Promise<UpdateAparienciaState> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return {
            ok: false,
            message: "Tu sesión expiró. Volvé a iniciar sesión.",
        };
    }

    const parsed = aparienciaSchema.safeParse({
        temaPreferido: formData.get("temaPreferido"),
        colorPrincipal: formData.get("colorPrincipal"),
    });

    if (!parsed.success) {
        return {
            ok: false,
            message: "Revisá los datos de apariencia.",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: parsed.data,
    });

    const cookieStore = await cookies();

    cookieStore.set("control-gastos-theme", parsed.data.temaPreferido, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
    });

    cookieStore.set("control-gastos-accent", parsed.data.colorPrincipal, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
    });

    revalidatePath("/configuracion");
    revalidatePath("/", "layout");

    return {
        ok: true,
        message: "Apariencia actualizada correctamente.",
    };
}