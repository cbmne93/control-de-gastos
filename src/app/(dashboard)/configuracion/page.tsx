import { BellRing, KeyRound, MonitorCog, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageHeader } from "@/components/shared";
import { prisma } from "@/lib/prisma-client";
import {
    AparienciaForm,
    CambiarPasswordForm,
    ConfiguracionCard,
    ConfiguracionNotificacionesForm,
    PerfilUsuarioForm,
} from "@/features/configuracion/components";

const DEFAULT_DIAS_AVISO = [2, 1, 0];

export default async function ConfiguracionPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            name: true,
            email: true,
            temaPreferido: true,
            colorPrincipal: true,
            configuracion: {
                select: {
                    avisarPorCorreo: true,
                    diasAviso: true,
                },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    const configuracionNotificacion = user.configuracion ?? {
        avisarPorCorreo: true,
        diasAviso: DEFAULT_DIAS_AVISO,
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <PageHeader
                title="Configuración"
                description="Administrá tu perfil, seguridad y preferencias generales del sistema."
            />

            <div className="grid gap-5 xl:grid-cols-2">
                <ConfiguracionCard
                    icon={UserRound}
                    title="Perfil de usuario"
                    description="Actualizá la información básica de tu cuenta."
                >
                    <PerfilUsuarioForm
                        name={user.name ?? "Usuario"}
                        email={user.email}
                    />
                </ConfiguracionCard>

                <ConfiguracionCard
                    icon={KeyRound}
                    title="Seguridad"
                    description="Cambiá tu contraseña de acceso al sistema."
                >
                    <CambiarPasswordForm />
                </ConfiguracionCard>

                <ConfiguracionCard
                    icon={BellRing}
                    title="Notificaciones"
                    description="Configurá los avisos automáticos de cuotas por vencer."
                >
                    <ConfiguracionNotificacionesForm
                        avisarPorCorreo={
                            configuracionNotificacion.avisarPorCorreo
                        }
                        diasAviso={configuracionNotificacion.diasAviso}
                    />
                </ConfiguracionCard>

                <ConfiguracionCard
                    icon={MonitorCog}
                    title="Apariencia"
                    description="Preferencias visuales generales de la aplicación."
                >
                    <AparienciaForm
                        temaPreferido={user.temaPreferido}
                        colorPrincipal={user.colorPrincipal}
                    />
                </ConfiguracionCard>
            </div>
        </div>
    );
}