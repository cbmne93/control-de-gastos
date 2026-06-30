import { type ReactNode } from "react";

type PageCardProps = {
    children: ReactNode;
    className?: string;
};

export function PageCard({ children, className = "" }: PageCardProps) {
    return (
        <section
            className={`rounded-3xl border border-(--app-border) bg-(--app-card) p-5 shadow-sm sm:p-6 ${className}`}
        >
            {children}
        </section>
    );
}