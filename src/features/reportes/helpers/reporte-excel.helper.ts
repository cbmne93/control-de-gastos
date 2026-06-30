import * as ExcelJS from "exceljs";

import { getReporteMonthRange } from "@/features/reportes/helpers/reporte-date.helper";
import { formatReporteFecha } from "@/features/reportes/helpers/reporte-format.helper";
import type {
    ReporteDetalleItem,
    ReporteMensualData,
} from "@/features/reportes/types/reporte.types";

function getHastaPeriodo(data: ReporteMensualData) {
    const { startOfNextMonth } = getReporteMonthRange(data.periodo);
    const hasta = new Date(startOfNextMonth);

    hasta.setDate(hasta.getDate() - 1);

    return hasta;
}

function getOrigenLabel(item: ReporteDetalleItem) {
    if (item.origen === "CUOTA" && item.cuota) {
        return `Cuota ${item.cuota.numeroCuota}/${item.cuota.totalCuotas}`;
    }

    return "Movimiento";
}

function getTipoLabel(item: ReporteDetalleItem) {
    if (item.tipo === "INGRESO") {
        return "Ingreso";
    }

    return "Gasto";
}

function getSignedMonto(item: ReporteDetalleItem) {
    return item.tipo === "INGRESO" ? item.monto : item.monto * -1;
}

function applyBorder(cell: ExcelJS.Cell) {
    cell.border = {
        top: { style: "thin", color: { argb: "FFD1D5DB" } },
        left: { style: "thin", color: { argb: "FFD1D5DB" } },
        bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
        right: { style: "thin", color: { argb: "FFD1D5DB" } },
    };
}

export async function buildReporteExcelBuffer(data: ReporteMensualData) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Detalle");

    const { startOfMonth } = getReporteMonthRange(data.periodo);
    const hasta = getHastaPeriodo(data);

    worksheet.mergeCells("A1:G1");

    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Detalle de Movimientos";
    titleCell.font = {
        bold: true,
        size: 14,
    };
    titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
    };

    worksheet.getRow(1).height = 24;

    worksheet.getCell("A2").value = "Desde";
    worksheet.getCell("B2").value = formatReporteFecha(startOfMonth);
    worksheet.getCell("C2").value = "Hasta";
    worksheet.getCell("D2").value = formatReporteFecha(hasta);

    ["A2", "C2"].forEach((cellAddress) => {
        worksheet.getCell(cellAddress).font = { bold: true };
    });

    worksheet.getRow(3).values = [
        "Fecha",
        "Tipo",
        "Descripción",
        "Categoría",
        "Cuenta",
        "Origen",
        "Monto",
    ];

    worksheet.getRow(3).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = {
            horizontal: "center",
            vertical: "middle",
        };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2E8F0" },
        };
        applyBorder(cell);
    });

    data.detalle.forEach((item) => {
        worksheet.addRow([
            formatReporteFecha(item.fecha),
            getTipoLabel(item),
            item.descripcion,
            item.categoria,
            item.cuenta,
            getOrigenLabel(item),
            getSignedMonto(item),
        ]);
    });

    worksheet.columns = [
        { key: "fecha", width: 14 },
        { key: "tipo", width: 14 },
        { key: "descripcion", width: 32 },
        { key: "categoria", width: 24 },
        { key: "cuenta", width: 26 },
        { key: "origen", width: 18 },
        { key: "monto", width: 16 },
    ];

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, columnNumber) => {
            if (rowNumber === 1) {
                cell.alignment = {
                    horizontal: "center",
                    vertical: "middle",
                };

                return;
            }

            if (rowNumber >= 3) {
                applyBorder(cell);
            }

            cell.alignment = {
                vertical: "middle",
                horizontal: columnNumber === 7 ? "right" : "left",
            };
        });
    });

    worksheet.getCell("A1").alignment = {
        horizontal: "center",
        vertical: "middle",
    };

    worksheet.getColumn(7).numFmt = "#,##0;[Red]-#,##0;0";

    worksheet.views = [
        {
            state: "frozen",
            ySplit: 3,
        },
    ];

    return workbook.xlsx.writeBuffer();
}

export function getReporteExcelFilename(data: ReporteMensualData) {
    const month = data.periodo.month.toString().padStart(2, "0");

    return `detalle-movimientos-${data.periodo.year}-${month}.xlsx`;
}