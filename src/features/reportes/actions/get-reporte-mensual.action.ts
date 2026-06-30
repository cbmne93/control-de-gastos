"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getReporteMensualData } from "@/features/reportes/actions/get-reporte-mensual-data.action";
import type {
    ReporteMensualData,
    ReportePeriodo,
} from "@/features/reportes/types/reporte.types";

export async function getReporteMensualAction(
    periodo: ReportePeriodo
): Promise<ReporteMensualData> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    return getReporteMensualData(userId, periodo);
}