"use server"

import { categories, ProductInsert, productOptionGroups, productOptions, products } from "@/db/schema";

import { db } from "@/db";
import { AddProductFormData } from "@/schemas/product";
import type { ActionResult } from "@/types/actions/action-result";
import { verifyOwnership } from "../auth/verify-ownership";
import slugify from "../utils/slugify";

import { and, eq } from "drizzle-orm";
export async function addProduct(storeId: string, productData: AddProductFormData): Promise<ActionResult<ProductInsert>> {
    try {
        const ownershipRes = await verifyOwnership(storeId);
        if (!ownershipRes.ok) return { ok: false, error: ownershipRes.error };

        // Resolve or create category
        const categorySlug = slugify(productData.category);
        let categoryId: string;

        const [existingCategory] = await db.select().from(categories).where(
            and(
                eq(categories.slug, categorySlug),
                eq(categories.storeId, storeId)
            )
        ).limit(1);

        if (existingCategory) {
            categoryId = existingCategory.id;
        } else {
            const [insertedCat] = await db.insert(categories).values({
                storeId,
                name: productData.category,
                slug: categorySlug,
            })
                .returning();
            categoryId = insertedCat.id;
        }

        // Prepare product payload
        const productPayload: ProductInsert = {
            storeId,
            name: productData.name,
            description: productData.description || null,
            categoryId,
            price: Math.round(productData.price * 100),
            imageUrl: productData.image || null,
            isAvailable: productData.isAvailable,
        };

        // Transaction: insert product with option groups and options
        const result = await db.transaction(async (tx) => {
            const [product] = await tx.insert(products).values(productPayload).returning();

            // Handle sub-options (option groups) if they exist
            if (productData.subOptions && productData.subOptions.length > 0) {
                for (let i = 0; i < productData.subOptions.length; i++) {
                    const subOption = productData.subOptions[i];

                    // Create option group
                    const [optionGroup] = await tx
                        .insert(productOptionGroups)
                        .values({
                            productId: product.id,
                            name: subOption.name,
                            required: subOption.required,
                            displayOrder: i,
                        })
                        .returning();

                    // Insert options for this group
                    if (subOption.options && subOption.options.length > 0) {
                        const optionsToInsert = subOption.options.map((option, idx) => ({
                            optionGroupId: optionGroup.id,
                            name: option.name,
                            price: Math.round(option.price * 100), // Convert to cents
                            displayOrder: idx,
                        }));

                        await tx.insert(productOptions).values(optionsToInsert);
                    }
                }
            }

            return product;
        });

        return { ok: true, data: result };
    } catch (error: any) {
        return {
            ok: false,
            error: {
                code: "INTERNAL",
                message: "Failed to add product",
                details: error?.message ?? String(error),
                status: 500,
            },
        };
    }
}
