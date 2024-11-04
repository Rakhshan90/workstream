import { z } from 'zod';

export const signUpSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    role: z.enum(["MANAGER", "EMPLOYEE"], {
        required_error: "Please select a role.",
    }),
});

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;