import { sendEmail } from "@/lib/email/email.service";
import { prisma } from "@/lib/prisma-client";

const DEFAULT_DIAS_AVISO = [2, 1, 0];

interface ProcesarAvisosCuotasJobResult {
    totalCuotasRevisadas: number;
    totalAvisosProcesados: number;
    totalNotificacionesCreadas: number;
    totalCorreosProcesados: number;
    totalCorreosOmitidos: number;
    totalOmitidos: number;
    totalOmitidosPorDiaNoConfigurado: number;
    totalOmitidosPorAvisoYaEnviado: number;
    totalOmitidosPorCuotaVencida: number;
    maxDiasAvisoConfigurado: number;
    errores: string[];
}

function getAppTimeZone() {
    return process.env.APP_TIME_ZONE || "America/Asuncion";
}

function getTodayDateKey(timeZone: string) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return formatter.format(new Date());
}

function parseDateKeyAsUtcDate(dateKey: string) {
    const [year, month, day] = dateKey.split("-").map(Number);

    return new Date(Date.UTC(year, month - 1, day));
}

function addDaysToDateKey(dateKey: string, days: number) {
    const date = parseDateKeyAsUtcDate(dateKey);
    date.setUTCDate(date.getUTCDate() + days);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getUtcDateKey(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDiasAntes(todayDateKey: string, fechaVencimiento: Date) {
    const today = parseDateKeyAsUtcDate(todayDateKey);
    const vencimiento = parseDateKeyAsUtcDate(getUtcDateKey(fechaVencimiento));

    const diffMs = vencimiento.getTime() - today.getTime();

    return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function formatMontoPYG(value: unknown) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatDateKey(date: Date) {
    const dateKey = getUtcDateKey(date);
    const [year, month, day] = dateKey.split("-");

    return `${day}/${month}/${year}`;
}

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getTituloAviso(diasAntes: number) {
    if (diasAntes === 0) {
        return "Una cuota vence hoy";
    }

    if (diasAntes === 1) {
        return "Una cuota vence mañana";
    }

    return `Una cuota vence en ${diasAntes} días`;
}

function getMensajeAviso(params: {
    descripcion: string;
    numeroCuota: number;
    totalCuotas: number;
    monto: unknown;
    fechaVencimiento: Date;
    diasAntes: number;
}) {
    const vencimientoTexto =
        params.diasAntes === 0
            ? "vence hoy"
            : params.diasAntes === 1
                ? "vence mañana"
                : `vence en ${params.diasAntes} días`;

    return `La cuota ${params.numeroCuota}/${params.totalCuotas} de "${params.descripcion}" ${vencimientoTexto}. Monto: ${formatMontoPYG(
        params.monto,
    )}. Fecha: ${formatDateKey(params.fechaVencimiento)}.`;
}

function buildEmailContent(params: {
    userName?: string | null;
    descripcion: string;
    categoria: string;
    cuenta: string;
    numeroCuota: number;
    totalCuotas: number;
    monto: unknown;
    fechaVencimiento: Date;
    diasAntes: number;
}) {
    const titulo = getTituloAviso(params.diasAntes);
    const descripcion = escapeHtml(params.descripcion);
    const categoria = escapeHtml(params.categoria);
    const cuenta = escapeHtml(params.cuenta);
    const nombre = escapeHtml(params.userName || "Usuario");
    const monto = formatMontoPYG(params.monto);
    const fecha = formatDateKey(params.fechaVencimiento);

    const text = `${titulo}

Hola ${params.userName || "Usuario"}.

Tenés una cuota próxima a vencer.

Movimiento: ${params.descripcion}
Categoría: ${params.categoria}
Cuenta: ${params.cuenta}
Cuota: ${params.numeroCuota}/${params.totalCuotas}
Monto: ${monto}
Vencimiento: ${fecha}`;

    const html = `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
            <h2 style="margin: 0 0 12px;">${escapeHtml(titulo)}</h2>

            <p>Hola <strong>${nombre}</strong>.</p>

            <p>Tenés una cuota próxima a vencer en tu sistema de control de gastos.</p>

            <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; background: #f8fafc;">
                <p><strong>Movimiento:</strong> ${descripcion}</p>
                <p><strong>Categoría:</strong> ${categoria}</p>
                <p><strong>Cuenta:</strong> ${cuenta}</p>
                <p><strong>Cuota:</strong> ${params.numeroCuota}/${params.totalCuotas}</p>
                <p><strong>Monto:</strong> ${monto}</p>
                <p><strong>Vencimiento:</strong> ${fecha}</p>
            </div>

            <p style="margin-top: 18px; color: #475569;">
                Este aviso fue generado automáticamente por Control de gastos.
            </p>
        </div>
    `;

    return {
        subject: titulo,
        text,
        html,
    };
}

function normalizeDiasAviso(diasAviso?: number[] | null) {
    if (!diasAviso || diasAviso.length === 0) {
        return DEFAULT_DIAS_AVISO;
    }

    const diasValidos = diasAviso.filter(
        (dia) => Number.isInteger(dia) && dia >= 0,
    );

    if (diasValidos.length === 0) {
        return DEFAULT_DIAS_AVISO;
    }

    return Array.from(new Set(diasValidos)).sort((a, b) => b - a);
}

function shouldSendAviso(params: {
    diasAntes: number;
    diasAviso?: number[] | null;
}) {
    const diasAviso = normalizeDiasAviso(params.diasAviso);

    return diasAviso.includes(params.diasAntes);
}

async function getMaxDiasAvisoConfigurados() {
    const configuraciones = await prisma.configuracionNotificacion.findMany({
        where: {
            user: {
                activo: true,
            },
        },
        select: {
            diasAviso: true,
        },
    });

    const diasConfigurados = configuraciones.flatMap((configuracion) =>
        normalizeDiasAviso(configuracion.diasAviso),
    );

    return Math.max(...DEFAULT_DIAS_AVISO, ...diasConfigurados);
}

export async function procesarAvisosCuotasJob(): Promise<ProcesarAvisosCuotasJobResult> {
    const timeZone = getAppTimeZone();
    const todayDateKey = getTodayDateKey(timeZone);
    const maxDiasAvisoConfigurado = await getMaxDiasAvisoConfigurados();

    const rangoInicio = parseDateKeyAsUtcDate(todayDateKey);
    const rangoFin = parseDateKeyAsUtcDate(
        addDaysToDateKey(todayDateKey, maxDiasAvisoConfigurado + 1),
    );

    const result: ProcesarAvisosCuotasJobResult = {
        totalCuotasRevisadas: 0,
        totalAvisosProcesados: 0,
        totalNotificacionesCreadas: 0,
        totalCorreosProcesados: 0,
        totalCorreosOmitidos: 0,
        totalOmitidos: 0,
        totalOmitidosPorDiaNoConfigurado: 0,
        totalOmitidosPorAvisoYaEnviado: 0,
        totalOmitidosPorCuotaVencida: 0,
        maxDiasAvisoConfigurado,
        errores: [],
    };

    const cuotas = await prisma.gastoCuota.findMany({
        where: {
            estado: {
                not: "PAGADA",
            },
            fechaVencimiento: {
                gte: rangoInicio,
                lt: rangoFin,
            },
            movimiento: {
                user: {
                    activo: true,
                },
            },
        },
        include: {
            movimiento: {
                include: {
                    categoria: {
                        select: {
                            nombre: true,
                        },
                    },
                    cuenta: {
                        select: {
                            nombre: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            configuracion: {
                                select: {
                                    avisarPorCorreo: true,
                                    diasAviso: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            fechaVencimiento: "asc",
        },
    });

    result.totalCuotasRevisadas = cuotas.length;

    for (const cuota of cuotas) {
        const diasAntes = getDiasAntes(todayDateKey, cuota.fechaVencimiento);
        const user = cuota.movimiento.user;
        const configuracion = user.configuracion;

        if (diasAntes < 0) {
            result.totalOmitidos += 1;
            result.totalOmitidosPorCuotaVencida += 1;
            continue;
        }

        if (
            !shouldSendAviso({
                diasAntes,
                diasAviso: configuracion?.diasAviso,
            })
        ) {
            result.totalOmitidos += 1;
            result.totalOmitidosPorDiaNoConfigurado += 1;
            continue;
        }

        try {
            let aviso = await prisma.cuotaAviso.findUnique({
                where: {
                    cuotaId_diasAntes: {
                        cuotaId: cuota.id,
                        diasAntes,
                    },
                },
            });

            if (aviso?.enviado) {
                result.totalOmitidos += 1;
                result.totalOmitidosPorAvisoYaEnviado += 1;
                continue;
            }

            const titulo = getTituloAviso(diasAntes);

            const mensaje = getMensajeAviso({
                descripcion: cuota.movimiento.descripcion,
                numeroCuota: cuota.numeroCuota,
                totalCuotas: cuota.totalCuotas,
                monto: cuota.monto,
                fechaVencimiento: cuota.fechaVencimiento,
                diasAntes,
            });

            if (!aviso) {
                aviso = await prisma.cuotaAviso.create({
                    data: {
                        cuotaId: cuota.id,
                        diasAntes,
                        enviado: false,
                    },
                });

                const notificacionExistente =
                    await prisma.notificacion.findFirst({
                        where: {
                            userId: user.id,
                            cuotaId: cuota.id,
                            tipo: "CUOTA_POR_VENCER",
                            titulo,
                        },
                        select: {
                            id: true,
                        },
                    });

                if (!notificacionExistente) {
                    await prisma.notificacion.create({
                        data: {
                            userId: user.id,
                            cuotaId: cuota.id,
                            titulo,
                            mensaje,
                            tipo: "CUOTA_POR_VENCER",
                        },
                    });

                    result.totalNotificacionesCreadas += 1;
                }
            }

            const avisarPorCorreo = configuracion?.avisarPorCorreo ?? true;

            if (avisarPorCorreo) {
                const emailContent = buildEmailContent({
                    userName: user.name,
                    descripcion: cuota.movimiento.descripcion,
                    categoria: cuota.movimiento.categoria.nombre,
                    cuenta: cuota.movimiento.cuenta.nombre,
                    numeroCuota: cuota.numeroCuota,
                    totalCuotas: cuota.totalCuotas,
                    monto: cuota.monto,
                    fechaVencimiento: cuota.fechaVencimiento,
                    diasAntes,
                });

                const emailResult = await sendEmail({
                    to: user.email,
                    subject: emailContent.subject,
                    html: emailContent.html,
                    text: emailContent.text,
                });

                if (emailResult.skipped) {
                    result.totalCorreosOmitidos += 1;
                } else {
                    result.totalCorreosProcesados += 1;
                }
            }

            await prisma.cuotaAviso.update({
                where: {
                    id: aviso.id,
                },
                data: {
                    enviado: true,
                    enviadoEn: new Date(),
                },
            });

            result.totalAvisosProcesados += 1;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Error desconocido procesando aviso de cuota.";

            result.errores.push(`Cuota ${cuota.id}: ${message}`);
        }
    }

    return result;
}