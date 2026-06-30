export type RegisterUserActionState = {
    success: boolean;
    message?: string;
    errors?: Partial<
        Record<
            "name" | "email" | "password" | "confirmPassword" | "general",
            string[]
        >
    >;
};