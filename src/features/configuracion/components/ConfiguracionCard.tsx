import { type LucideIcon } from "lucide-react";

interface ConfiguracionCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    children: React.ReactNode;
}

export function ConfiguracionCard({
    icon: Icon,
    title,
    description,
    children,
}: ConfiguracionCardProps) {
    return (
        <section className="rounded-3xl border border-(--app-border) bg-(--app-card) p-5 shadow-sm">
            <div className="flex items-start gap-3 border-b border-(--app-border) pb-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                    <Icon className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-base font-bold text-foreground">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mt-4">{children}</div>
        </section>
    );
}