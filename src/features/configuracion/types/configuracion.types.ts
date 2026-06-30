export type ConfiguracionActionState = {
    success: boolean;
    message?: string;
    timestamp?: number;
    errors?: Partial<
        Record<
            | "name"
            | "currentPassword"
            | "newPassword"
            | "confirmPassword"
            | "general",
            string[]
        >
    >;
};