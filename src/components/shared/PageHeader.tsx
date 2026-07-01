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
            <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:items-start sm:gap-4">
                        {Icon ? (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted) sm:h-12 sm:w-12">
                                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                        ) : null}

                        <div className="min-w-0">
                            <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                {title}
                            </h1>

                            {description ? (
                                <p className="mt-2 hidden max-w-3xl text-sm leading-6 text-slate-500 sm:block">
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