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
}

function getEmailProvider() {
    return process.env.EMAIL_PROVIDER?.trim().toLowerCase() || "console";
}

function isEmailEnabled() {
    return process.env.EMAIL_ENABLED === "true";
}

async function sendConsoleEmail(
    input: SendEmailInput,
): Promise<SendEmailResult> {
    console.info("[EMAIL_CONSOLE]", {
        to: input.to,
        subject: input.subject,
        text: input.text,
    });

    return {
        success: true,
        provider: "console",
        skipped: !isEmailEnabled(),
    };
}

async function sendResendEmail(
    input: SendEmailInput,
): Promise<SendEmailResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey) {
        throw new Error("Falta configurar RESEND_API_KEY.");
    }

    if (!from) {
        throw new Error("Falta configurar EMAIL_FROM.");
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to: input.to,
            subject: input.subject,
            html: input.html,
            text: input.text,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `No se pudo enviar el correo con Resend. Estado: ${response.status}. ${errorText}`,
        );
    }

    return {
        success: true,
        provider: "resend",
        skipped: false,
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