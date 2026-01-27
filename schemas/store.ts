import { isReservedSlug } from "@/lib/reserved-slugs"
import z from "zod"

export const storeSchema = z.object({
    name: z.string().min(2, "Store name must be at least 2 characters").max(100, "Store name must be less than 100 characters"),
    slug: z.string()
        .min(3, "Slug must be at least 3 characters")
        .max(50, "Slug must be less than 50 characters")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
        .refine((s) => !isReservedSlug(s), {
            message: "That slug is reserved. Please choose a different slug.",
        }),
    description: z.string().max(500, "Description must be less than 500 characters").nullable(),
    timezone: z.string().min(3, "Timezone must be at least 3 characters").max(50, "Timezone must be less than 50 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits").nullable(),
    email: z.email("Invalid email address").or(z.literal("")).nullable(),
    address: z.string().max(200, "Address must be less than 200 characters").nullable(),
    logoUrl: z.url("Logo URL must be a valid URL").nullable(),
})

export type StoreSchema = z.infer<typeof storeSchema>