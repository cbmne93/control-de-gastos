"use client";

import { Menu, X } from "lucide-react";

import { HeaderActions } from "./HeaderActions";
import { HeaderUser } from "./HeaderUser";

interface AppHeaderProps {
    userName?: string | null;
    userEmail?: string | null;
    mobileMenuOpen: boolean;
    showQuickNewMovimiento: boolean;
    notificacionesNoLeidas: number;
    onToggleMobileMenu: () => void;
}

export function AppHeader({
    userName,
    userEmail,
    mobileMenuOpen,
    showQuickNewMovimiento,
    notificacionesNoLeidas,
    onToggleMobileMenu,
}: AppHeaderProps) {
    return (
        <header className="sticky top-0 z-20 h-20 border-b border-(--app-border) bg-(--app-card)/95 px-4 shadow-sm backdrop-blur lg:px-8">
            <div className="flex h-full items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        aria-label={
                            mobileMenuOpen ? "Cerrar menú" : "Abrir menú"
                        }
                        onClick={onToggleMobileMenu}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--app-border) bg-(--app-card) text-(--app-primary) shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) lg:hidden"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>

                    <HeaderUser userName={userName} userEmail={userEmail} />
                </div>

                <HeaderActions
                    showQuickNewMovimiento={showQuickNewMovimiento}
                    notificacionesNoLeidas={notificacionesNoLeidas}
                />
            </div>
        </header>
    );
}