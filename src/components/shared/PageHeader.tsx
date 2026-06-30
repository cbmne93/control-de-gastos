import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

type PageHeaderProps = {
    title: string;
    description?: string;
    icon?: LucideIcon;
    action?: ReactNode;
};

export function PageHeader({
    title,
    description,
    icon: Icon,
    action,
}: PageHeaderProps) {
    return (
        <section className="overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) shadow-sm">
            <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        {Icon ? (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                                <Icon className="h-6 w-6" />
                            </div>
                        ) : null}

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {title}
                            </h1>

                            {description ? (
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                                    {description}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    {action ? <div className="shrink-0">{action}</div> : null}
                </div>
            </div>

            <div className="h-1.5 bg-(--app-primary)" />
        </section>
    );
}