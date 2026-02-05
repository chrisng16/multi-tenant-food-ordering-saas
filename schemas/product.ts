import { z } from "zod"

export const PRESET_CATEGORIES = ["Pizza", "Pasta", "Salads", "Beverages", "Desserts", "Appetizers"]

// Validation schema
export const optionSchema = z.object({
    id: z.string().min(1, "Option ID is required"),
    name: z.string().min(1, "Option name is required"),
    price: z.number().min(0, "Price must be 0 or greater"),
})

export const subOptionSchema = z.object({
    id: z.string().min(1, "Sub-option ID is required"),
    name: z.string().min(1, "Sub-option name is required"),
    required: z.boolean(),
    options: z.array(optionSchema).min(1, "At least one option is required"),
})

export const addProductSchema = z.object({
    name: z.string().min(1, "Product name is required").min(3, "Name must be at least 3 characters"),
    description: z.string().nullable().or(z.literal("")),
    price: z.number().min(0.01, "Price must be greater than 0"),
    category: z.string().min(1, "Category is required"),
    images: z.array(z.string().url("Please enter a valid image URL")).nullable(),
    isAvailable: z.boolean(),
    subOptions: z.array(subOptionSchema).nullable(),
})

export type AddProductFormData = z.infer<typeof addProductSchema>