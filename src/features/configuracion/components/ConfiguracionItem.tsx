interface ConfiguracionItemProps {
    label: string;
    value: string;
    helper?: string;
}

export function ConfiguracionItem({
    label,
    value,
    helper,
}: ConfiguracionItemProps) {
    return (
        <div className="flex flex-col gap-1 rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-700">
                    {label}
                </p>

                {helper ? (
                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                        {helper}
                    </p>
                ) : null}
            </div>

            <p className="text-sm font-bold text-foreground">{value}</p>
        </div>
    );
}