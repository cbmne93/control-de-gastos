import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { RegistroForm } from "@/features/registro/components";

export default async function RegistroPage() {
    const session = await auth();

    if (session?.user) {
        redirect("/dashboard");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <RegistroForm />
        </main>
    );
}