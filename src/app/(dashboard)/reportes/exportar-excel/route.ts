import { auth } from "@/auth";
import { getReporteMensualData } from "@/features/reportes/actions";
import {
    buildReporteExcelBuffer,
    getReporteExcelFilename,
    normalizeReportePeriodo,
} from "@/features/reportes/helpers";

export const runtime = "nodejs";

export async function GET(request: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return Response.redirect(new URL("/login", request.url));
    }

    const { searchParams } = new URL(request.url);

    const periodo = normalizeReportePeriodo(
        searchParams.get("month") ?? undefined,
        searchParams.get("year") ?? undefined
    );

    const data = await getReporteMensualData(userId, periodo);
    const buffer = await buildReporteExcelBuffer(data);
    const filename = getReporteExcelFilename(data);

    return new Response(buffer, {
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store",
        },
    });
}