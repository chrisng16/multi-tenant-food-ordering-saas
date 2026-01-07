import z from "zod";
import { emailSchema, passwordSchema } from './validators';

export const signInSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    rememberMe: z.boolean().optional(),
})
export const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

export const storeSchema = z.object({
    name: z.string().min(2, "Store name must be at least 2 characters").max(100, "Store name must be less than 100 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").max(50, "Slug must be less than 50 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
})

export type StoreFormData = z.infer<typeof storeSchema>