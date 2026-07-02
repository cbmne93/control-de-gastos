import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import { auth } from "@/auth";
import { SessionTimeoutWatcher } from "@/components/auth/SessionTimeoutWatcher";
import { AppLayout } from "@/components/layout/AppLayout";
import { getNotificacionesNoLeidasCountAction } from "@/features/notificaciones/actions";
import { prisma } from "@/lib/prisma-client";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const [user, notificacionesNoLeidas] = await Promise.all([
        prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                name: true,
                email: true,
            },
        }),

        getNotificacionesNoLeidasCountAction(),
    ]);

    if (!user) {
        redirect("/login");
    }

    return (
        <AppLayout
            userName={user.name}
            userEmail={user.email}
            notificacionesNoLeidas={notificacionesNoLeidas}
        >
            <SessionTimeoutWatcher />
            {children}
        </AppLayout>
    );
}