import { Loader2 } from "lucide-react";

interface PageLoadingProps {
    title?: string;
    description?: string;
}

export function PageLoading({
    title = "Cargando información",
    description = "Preparando los datos del sistema...",
}: PageLoadingProps) {
    return (
        <div className="space-y-5">
            <section className="overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) shadow-sm">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted) sm:h-12 sm:w-12">
                            <Loader2 className="h-5 w-5 animate-spin sm:h-6 sm:w-6" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                {title}
                            </h1>

                            <p className="mt-2 hidden text-sm leading-6 text-slate-500 sm:block">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-1.5 bg-(--app-primary)" />
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-(--app-border) bg-(--app-card) p-4 shadow-sm sm:p-5"
                    >
                        <div className="h-10 w-10 animate-pulse rounded-xl bg-(--app-card-soft)" />

                        <div className="mt-4 h-3 w-28 animate-pulse rounded-full bg-(--app-card-soft)" />

                        <div className="mt-3 h-6 w-36 animate-pulse rounded-full bg-(--app-card-soft)" />
                    </div>
                ))}
            </section>

            <section className="rounded-3xl border border-(--app-border) bg-(--app-card) p-4 shadow-sm sm:p-5">
                <div className="space-y-3">
                    <div className="h-4 w-40 animate-pulse rounded-full bg-(--app-card-soft)" />

                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-12 animate-pulse rounded-2xl bg-(--app-card-soft)"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}