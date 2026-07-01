"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DismissibleUrlAlertProps {
    message: string;
    paramsToRemove: string[];
    duration?: number;
}

export function DismissibleUrlAlert({
    message,
    paramsToRemove,
    duration = 3500,
}: DismissibleUrlAlertProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchParamsString = searchParams.toString();

    const [hiddenMessageKey, setHiddenMessageKey] = useState<string | null>(
        null,
    );

    const paramsKey = useMemo(() => {
        return paramsToRemove.join("|");
    }, [paramsToRemove]);

    const messageKey = useMemo(() => {
        return `${message}|${paramsKey}|${searchParamsString}`;
    }, [message, paramsKey, searchParamsString]);

    const isVisible = Boolean(message) && hiddenMessageKey !== messageKey;

    useEffect(() => {
        if (!message) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setHiddenMessageKey(messageKey);

            const params = new URLSearchParams(searchParamsString);

            paramsKey
                .split("|")
                .filter(Boolean)
                .forEach((param) => {
                    params.delete(param);
                });

            const queryString = params.toString();

            router.replace(
                queryString ? `${pathname}?${queryString}` : pathname,
                {
                    scroll: false,
                },
            );
        }, duration);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [
        duration,
        message,
        messageKey,
        paramsKey,
        pathname,
        router,
        searchParamsString,
    ]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
        </div>
    );
}