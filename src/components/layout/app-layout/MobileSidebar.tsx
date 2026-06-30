"use client";

import { SidebarContent } from "./SidebarContent";

interface MobileSidebarProps {
    open: boolean;
    notificacionesNoLeidas: number;
    onClose: () => void;
}

export function MobileSidebar({
    open,
    notificacionesNoLeidas,
    onClose,
}: MobileSidebarProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <button
                type="button"
                aria-label="Cerrar menú"
                className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
                onClick={onClose}
            />

            <aside className="relative h-dvh w-[84%] max-w-80 shadow-2xl">
                <SidebarContent
                    onNavigate={onClose}
                    notificacionesNoLeidas={notificacionesNoLeidas}
                />
            </aside>
        </div>
    );
}