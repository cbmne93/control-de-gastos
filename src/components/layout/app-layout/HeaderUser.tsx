interface HeaderUserProps {
    userName?: string | null;
    userEmail?: string | null;
}

export function HeaderUser({ userName, userEmail }: HeaderUserProps) {
    return (
        <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">
                {userName ?? "Usuario"}
            </p>

            <p className="truncate text-xs font-medium text-slate-500">
                {userEmail ?? "Sesión activa"}
            </p>
        </div>
    );
}