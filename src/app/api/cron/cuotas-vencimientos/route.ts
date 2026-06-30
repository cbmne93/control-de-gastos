import { NextResponse, type NextRequest } from "next/server";

import { procesarAvisosCuotasJob } from "@/features/cuotas/jobs/procesar-avisos-cuotas.job";

function getBearerToken(request: NextRequest) {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
        return null;
    }

    return authorization.replace("Bearer ", "").trim();
}

function validateCronSecret(request: NextRequest) {
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
        return {
            valid: false,
            status: 500,
            message: "Falta configurar CRON_SECRET.",
        };
    }

    const token = getBearerToken(request);

    if (token !== cronSecret) {
        return {
            valid: false,
            status: 401,
            message: "No autorizado.",
        };
    }

    return {
        valid: true,
        status: 200,
        message: "OK",
    };
}

export async function GET(request: NextRequest) {
    const validation = validateCronSecret(request);

    if (!validation.valid) {
        return NextResponse.json(
            {
                ok: false,
                message: validation.message,
            },
            {
                status: validation.status,
            },
        );
    }

    const result = await procesarAvisosCuotasJob();

    return NextResponse.json({
        ok: true,
        result,
    });
}

export async function POST(request: NextRequest) {
    return GET(request);
}