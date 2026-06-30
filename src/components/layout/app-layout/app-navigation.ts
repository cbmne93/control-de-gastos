import {
    BarChart3,
    Bell,
    CreditCard,
    Home,
    ListChecks,
    Settings,
    Tags,
    Wallet,
    type LucideIcon,
} from "lucide-react";

export type NavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};

export const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Movimientos", href: "/movimientos", icon: ListChecks },
    { label: "Cuotas / Vencimientos", href: "/cuotas", icon: CreditCard },
    { label: "Notificaciones", href: "/notificaciones", icon: Bell },
    { label: "Categorías", href: "/categorias", icon: Tags },
    { label: "Cuentas", href: "/cuentas", icon: Wallet },
    { label: "Reportes", href: "/reportes", icon: BarChart3 },
    { label: "Configuración", href: "/configuracion", icon: Settings },
];