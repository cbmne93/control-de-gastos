import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

type EmptyStateProps = {
    title: string;
    description?: string;
    icon?: LucideIcon;
    action?: ReactNode;
};

export function EmptyState({
    title,
    description,
    icon: Icon,
    action,
}: EmptyStateProps) {
    return (
        <div className="rounded-2xl border border-dashed border-(--app-border) bg-(--app-card-soft) p-8 text-center">
            {Icon ? (
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-(--app-card) text-(--app-primary) shadow-sm ring-1 ring-(--app-primary-muted)">
                    <Icon className="h-6 w-6" />
                </div>
            ) : null}

            <h3 className="text-sm font-bold text-foreground">{title}</h3>

            {description ? (
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {description}
                </p>
            ) : null}

            {action ? <div className="mt-5">{action}</div> : null}
        </div>
    );
}