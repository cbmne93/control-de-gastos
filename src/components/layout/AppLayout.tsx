"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import {
    AppHeader,
    MobileSidebar,
    SidebarContent,
} from "./app-layout";

type AppLayoutProps = {
    children: ReactNode;
    userName?: string | null;
    userEmail?: string | null;
    notificacionesNoLeidas?: number;
};

export function AppLayout({
    children,
    userName,
    userEmail,
    notificacionesNoLeidas = 0,
}: AppLayoutProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const showQuickNewMovimiento = !pathname.startsWith("/movimientos");

    return (
        <div className="min-h-screen bg-background">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
                <SidebarContent
                    notificacionesNoLeidas={notificacionesNoLeidas}
                />
            </aside>

            <MobileSidebar
                open={mobileMenuOpen}
                notificacionesNoLeidas={notificacionesNoLeidas}
                onClose={() => setMobileMenuOpen(false)}
            />

            <div className="lg:pl-72">
                <AppHeader
                    userName={userName}
                    userEmail={userEmail}
                    mobileMenuOpen={mobileMenuOpen}
                    showQuickNewMovimiento={showQuickNewMovimiento}
                    notificacionesNoLeidas={notificacionesNoLeidas}
                    onToggleMobileMenu={() =>
                        setMobileMenuOpen((currentValue) => !currentValue)
                    }
                />

                <main className="min-h-[calc(100vh-80px)] bg-background px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}