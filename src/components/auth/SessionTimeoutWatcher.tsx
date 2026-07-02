"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { Clock3 } from "lucide-react";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const WARNING_BEFORE_TIMEOUT_MS = 60 * 1000;
const ACTIVITY_THROTTLE_MS = 1000;

export function SessionTimeoutWatcher() {
    const [showWarning, setShowWarning] = useState(false);

    const lastActivityRef = useRef(0);
    const lastHandledActivityRef = useRef(0);
    const showWarningRef = useRef(false);
    const hasSignedOutRef = useRef(false);

    const warningTimeoutRef = useRef<number | null>(null);
    const logoutTimeoutRef = useRef<number | null>(null);
    const resetSessionTimerRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const initialNow = Date.now();

        lastActivityRef.current = initialNow;
        lastHandledActivityRef.current = initialNow;

        function clearTimers() {
            if (warningTimeoutRef.current !== null) {
                window.clearTimeout(warningTimeoutRef.current);
                warningTimeoutRef.current = null;
            }

            if (logoutTimeoutRef.current !== null) {
                window.clearTimeout(logoutTimeoutRef.current);
                logoutTimeoutRef.current = null;
            }
        }

        function hideWarning() {
            showWarningRef.current = false;
            setShowWarning(false);
        }

        function showTimeoutWarning() {
            showWarningRef.current = true;
            setShowWarning(true);
        }

        function handleSignOut() {
            if (hasSignedOutRef.current) {
                return;
            }

            hasSignedOutRef.current = true;

            void signOut({
                callbackUrl: "/login",
            });
        }

        function scheduleTimers() {
            clearTimers();

            const elapsed = Date.now() - lastActivityRef.current;
            const remaining = SESSION_TIMEOUT_MS - elapsed;

            if (remaining <= 0) {
                handleSignOut();
                return;
            }

            const warningDelay = Math.max(
                remaining - WARNING_BEFORE_TIMEOUT_MS,
                0,
            );

            warningTimeoutRef.current = window.setTimeout(() => {
                showTimeoutWarning();
            }, warningDelay);

            logoutTimeoutRef.current = window.setTimeout(() => {
                handleSignOut();
            }, remaining);
        }

        function registerActivity(force = false) {
            const now = Date.now();

            if (
                !force &&
                !showWarningRef.current &&
                now - lastHandledActivityRef.current < ACTIVITY_THROTTLE_MS
            ) {
                return;
            }

            lastHandledActivityRef.current = now;
            lastActivityRef.current = now;

            hideWarning();
            scheduleTimers();
        }

        function handleUserActivity() {
            registerActivity();
        }

        function handleVisibilityChange() {
            if (document.visibilityState !== "visible") {
                return;
            }

            const elapsed = Date.now() - lastActivityRef.current;

            if (elapsed >= SESSION_TIMEOUT_MS) {
                handleSignOut();
                return;
            }

            scheduleTimers();
        }

        resetSessionTimerRef.current = () => {
            registerActivity(true);
        };

        const events: Array<keyof WindowEventMap> = [
            "click",
            "keydown",
            "mousemove",
            "scroll",
            "touchstart",
        ];

        events.forEach((eventName) => {
            window.addEventListener(eventName, handleUserActivity, {
                passive: true,
            });
        });

        document.addEventListener("visibilitychange", handleVisibilityChange);

        scheduleTimers();

        return () => {
            clearTimers();

            events.forEach((eventName) => {
                window.removeEventListener(eventName, handleUserActivity);
            });

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );

            resetSessionTimerRef.current = null;
        };
    }, []);

    if (!showWarning) {
        return null;
    }

    return (
        <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-96">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-lg">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <Clock3 className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-amber-900">
                            Tu sesión está por cerrarse
                        </p>

                        <p className="mt-1 text-sm font-medium text-amber-800">
                            Por seguridad, la sesión se cerrará por
                            inactividad.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                resetSessionTimerRef.current?.();
                            }}
                            className="mt-3 inline-flex h-9 items-center justify-center rounded-xl bg-amber-700 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-amber-800"
                        >
                            Continuar sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}