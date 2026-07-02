import { Resend } from "resend";

export interface SendEmailInput {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export interface SendEmailResult {
    success: boolean;
    provider: string;
    skipped: boolean;
    id?: string;
    originalTo?: string;
    deliveredTo?: string;
}

let resendClient: Resend | null = null;

function getEmailProvider() {
    return process.env.EMAIL_PROVIDER?.trim().toLowerCase() || "console";
}

function isEmailEnabled() {
    return process.env.EMAIL_ENABLED === "true";
}

function getEmailFrom() {
    return process.env.EMAIL_FROM?.trim();
}

function getEmailTestTo() {
    return process.env.EMAIL_TEST_TO?.trim();
}

function getResendClient() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error("Falta configurar RESEND_API_KEY.");
    }

    if (!resendClient) {
        resendClient = new Resend(apiKey);
    }

    return resendClient;
}

function getDeliveredTo(inputTo: string) {
    const testTo = getEmailTestTo();

    if (testTo) {
        return testTo;
    }

    return inputTo;
}

function buildTestHtmlNotice(originalTo: string, deliveredTo: string) {
    if (originalTo === deliveredTo) {
        return "";
    }

    return `
        <div style="margin-bottom: 16px; border: 1px solid #fde68a; border-radius: 12px; padding: 12px; background: #fffbeb; color: #92400e;">
            <strong>Modo prueba:</strong>
            este correo iba dirigido originalmente a <strong>${originalTo}</strong>,
            pero fue enviado a <strong>${deliveredTo}</strong> porque EMAIL_TEST_TO está configurado.
        </div>
    `;
}

function buildTestTextNotice(originalTo: string, deliveredTo: string) {
    if (originalTo === deliveredTo) {
        return "";
    }

    return `Modo prueba: este correo iba dirigido originalmente a ${originalTo}, pero fue enviado a ${deliveredTo} porque EMAIL_TEST_TO está configurado.\n\n`;
}

async function sendConsoleEmail(
    input: SendEmailInput,
): Promise<SendEmailResult> {
    const deliveredTo = getDeliveredTo(input.to);

    console.info("[EMAIL_CONSOLE]", {
        originalTo: input.to,
        deliveredTo,
        subject: input.subject,
        text: input.text,
        html: input.html,
    });

    return {
        success: true,
        provider: "console",
        skipped: !isEmailEnabled(),
        originalTo: input.to,
        deliveredTo,
    };
}

async function sendResendEmail(
    input: SendEmailInput,
): Promise<SendEmailResult> {
    const from = getEmailFrom();

    if (!from) {
        throw new Error("Falta configurar EMAIL_FROM.");
    }

    const resend = getResendClient();
    const deliveredTo = getDeliveredTo(input.to);

    const htmlNotice = buildTestHtmlNotice(input.to, deliveredTo);
    const textNotice = buildTestTextNotice(input.to, deliveredTo);

    const { data, error } = await resend.emails.send({
        from,
        to: deliveredTo,
        subject: input.subject,
        html: `${htmlNotice}${input.html}`,
        text: input.text ? `${textNotice}${input.text}` : undefined,
    });

    if (error) {
        throw new Error(
            `No se pudo enviar el correo con Resend: ${error.message}`,
        );
    }

    return {
        success: true,
        provider: "resend",
        skipped: false,
        id: data?.id,
        originalTo: input.to,
        deliveredTo,
    };
}

export async function sendEmail(
    input: SendEmailInput,
): Promise<SendEmailResult> {
    const provider = getEmailProvider();

    if (!isEmailEnabled()) {
        return sendConsoleEmail(input);
    }

    if (provider === "resend") {
        return sendResendEmail(input);
    }

    return sendConsoleEmail(input);
}