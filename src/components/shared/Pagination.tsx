import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
    queryParams?: Record<string, string | number | undefined | null>;
}

function buildHref({
    basePath,
    page,
    queryParams,
}: {
    basePath: string;
    page: number;
    queryParams?: Record<string, string | number | undefined | null>;
}) {
    const params = new URLSearchParams();

    Object.entries(queryParams ?? {}).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
            return;
        }

        params.set(key, String(value));
    });

    if (page > 1) {
        params.set("page", String(page));
    } else {
        params.delete("page");
    }

    const queryString = params.toString();

    return queryString ? `${basePath}?${queryString}` : basePath;
}

function getPageItems(currentPage: number, totalPages: number) {
    const pages: Array<number | "..."> = [];

    if (totalPages <= 7) {
        for (let page = 1; page <= totalPages; page += 1) {
            pages.push(page);
        }

        return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
        pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
        pages.push(page);
    }

    if (currentPage < totalPages - 3) {
        pages.push("...");
    }

    pages.push(totalPages);

    return pages;
}

export function Pagination({
    currentPage,
    totalPages,
    basePath,
    queryParams,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const pageItems = getPageItems(safeCurrentPage, totalPages);

    const previousPage = Math.max(safeCurrentPage - 1, 1);
    const nextPage = Math.min(safeCurrentPage + 1, totalPages);

    return (
        <nav
            className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-(--app-border) bg-(--app-card) px-4 py-4 shadow-sm sm:flex-row"
            aria-label="Paginación"
        >
            <p className="text-sm font-medium text-slate-500">
                Página{" "}
                <span className="font-bold text-foreground">
                    {safeCurrentPage}
                </span>{" "}
                de{" "}
                <span className="font-bold text-foreground">{totalPages}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <Link
                    href={buildHref({
                        basePath,
                        page: previousPage,
                        queryParams,
                    })}
                    aria-disabled={safeCurrentPage === 1}
                    className={[
                        "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold shadow-sm transition",
                        safeCurrentPage === 1
                            ? "pointer-events-none border-(--app-border) bg-(--app-card-soft) text-slate-400"
                            : "border-(--app-border) bg-(--app-card) text-slate-700 hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary)",
                    ].join(" ")}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Link>

                {pageItems.map((item, index) => {
                    if (item === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-sm font-bold text-slate-400"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = item === safeCurrentPage;

                    return (
                        <Link
                            key={item}
                            href={buildHref({
                                basePath,
                                page: item,
                                queryParams,
                            })}
                            aria-current={isActive ? "page" : undefined}
                            className={[
                                "inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-bold shadow-sm transition",
                                isActive
                                    ? "bg-(--app-primary) text-white"
                                    : "border border-(--app-border) bg-(--app-card) text-slate-700 hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary)",
                            ].join(" ")}
                        >
                            {item}
                        </Link>
                    );
                })}

                <Link
                    href={buildHref({
                        basePath,
                        page: nextPage,
                        queryParams,
                    })}
                    aria-disabled={safeCurrentPage === totalPages}
                    className={[
                        "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold shadow-sm transition",
                        safeCurrentPage === totalPages
                            ? "pointer-events-none border-(--app-border) bg-(--app-card-soft) text-slate-400"
                            : "border-(--app-border) bg-(--app-card) text-slate-700 hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary)",
                    ].join(" ")}
                >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </nav>
    );
}