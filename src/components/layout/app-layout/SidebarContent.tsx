"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/features/auth/actions/logout.action";

import { AppLogo } from "./AppLogo";
import { navItems } from "./app-navigation";

interface SidebarContentProps {
    onNavigate?: () => void;
    notificacionesNoLeidas?: number;
}

function isNavItemActive(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarContent({
    onNavigate,
    notificacionesNoLeidas = 0,
}: SidebarContentProps) {
    const pathname = usePathname();

    return (
        <div className="flex h-dvh min-h-0 flex-col border-r border-(--app-border) bg-(--app-card) text-foreground">
            <div className="shrink-0">
                <AppLogo />
            </div>

            <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isNavItemActive(pathname, item.href);
                    const showBadge =
                        item.href === "/notificaciones" &&
                        notificacionesNoLeidas > 0;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={[
                                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                                isActive
                                    ? "bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)"
                                    : "text-slate-600 hover:bg-(--app-card-soft) hover:text-foreground",
                            ].join(" ")}
                        >
                            <Icon
                                className={[
                                    "h-5 w-5 shrink-0",
                                    isActive
                                        ? "text-(--app-primary)"
                                        : "text-slate-500",
                                ].join(" ")}
                            />

                            <span className="truncate">{item.label}</span>

                            {showBadge ? (
                                <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                                    {notificacionesNoLeidas}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </nav>

            <div className="shrink-0 border-t border-(--app-border) bg-(--app-card) p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="flex h-12 w-full items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-3 text-sm font-bold text-rose-700 shadow-sm transition hover:bg-rose-100"
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-rose-700 ring-1 ring-rose-100">
                            <LogOut className="h-4 w-4" />
                        </span>

                        <span className="truncate">Cerrar sesión</span>
                    </button>
                </form>
            </div>
        </div>
    );
}