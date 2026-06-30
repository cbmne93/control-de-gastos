import { type LucideIcon } from "lucide-react";

type StatCardProps = {
    title: string;
    value: string | number;
    icon: LucideIcon;
    variant?: "success" | "danger" | "info" | "warning" | "default";
};

const variantClassNames = {
    success: "bg-emerald-50 text-emerald-700",
    danger: "bg-rose-50 text-rose-700",
    info: "bg-(--app-primary-soft) text-(--app-primary)",
    warning: "bg-amber-50 text-amber-700",
    default: "bg-(--app-primary-soft) text-(--app-primary)",
};

export function StatCard({
    title,
    value,
    icon: Icon,
    variant = "default",
}: StatCardProps) {
    return (
        <div className="rounded-2xl border border-(--app-border) bg-(--app-card) p-5 shadow-sm">
            <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${variantClassNames[variant]}`}
            >
                <Icon className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        </div>
    );
}