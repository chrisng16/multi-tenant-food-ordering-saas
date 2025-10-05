import { z } from 'zod';

export const emailSchema = z.email();
export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character");