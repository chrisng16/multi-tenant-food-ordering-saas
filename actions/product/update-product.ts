"use server"
import { db } from "@/db";
import { categories, ProductInsert, productOptionGroups, productOptions, products } from "@/db/schema";
import { AddProductFormData } from "@/schemas/product";
import { ActionResult } from "@/types/actions/action-result";
import { and, eq } from "drizzle-orm";
import { verifyOwnership } from "../auth/verify-ownership";

export async function updateProduct(
    storeId: string,
    productId: string,
    productData: Partial<AddProductFormData>
): Promise<ActionResult<ProductInsert>> {
    try {
        const ownershipRes = await verifyOwnership(storeId);
        if (!ownershipRes.ok) return { ok: false, error: ownershipRes.error };

        // Verify product belongs to store
        const [existingProduct] = await db
            .select()
            .from(products)
            .where(and(eq(products.id, productId), eq(products.storeId, storeId)))
            .limit(1);

        if (!existingProduct) {
            return {
                ok: false,
                error: {
                    code: "NOT_FOUND",
                    message: "Product not found",
                    status: 404,
                },
            };
        }

        const result = await db.transaction(async (tx) => {
            // Handle category if provided
            let categoryId = existingProduct.categoryId;
            if (productData.category) {
                const [existingCategory] = await tx
                    .select()
                    .from(categories)
                    .where(
                        and(
                            eq(categories.id, categoryId),
                            eq(categories.storeId, storeId)
                        )
                    )
                    .limit(1);

                if (existingCategory) {
                    categoryId = existingCategory.id;
                } else {
                    const [insertedCat] = await tx
                        .insert(categories)
                        .values({
                            storeId,
                            name: productData.category,
                            slug: "",
                        })
                        .returning();
                    categoryId = insertedCat.id;
                }
            }

            // Prepare update payload
            const updatePayload: Partial<ProductInsert> = {};

            if (productData.name !== undefined) updatePayload.name = productData.name;
            if (productData.description !== undefined) updatePayload.description = productData.description || null;
            if (categoryId) updatePayload.categoryId = categoryId;
            if (productData.price !== undefined) updatePayload.price = Math.round(productData.price * 100);
            if (productData.isAvailable !== undefined) updatePayload.isAvailable = productData.isAvailable;

            // Update product
            const [updatedProduct] = await tx
                .update(products)
                .set(updatePayload)
                .where(eq(products.id, productId))
                .returning();

            // Handle sub-options if provided
            if (productData.subOptions !== undefined) {
                // Get existing option groups
                const existingGroups = await tx
                    .select()
                    .from(productOptionGroups)
                    .where(eq(productOptionGroups.productId, productId));

                // Delete all existing option groups and their options (cascade will handle options)
                if (existingGroups.length > 0) {
                    await tx
                        .delete(productOptionGroups)
                        .where(eq(productOptionGroups.productId, productId));
                }

                // Insert new option groups and options
                if (productData.subOptions && productData.subOptions.length > 0) {
                    for (let i = 0; i < productData.subOptions.length; i++) {
                        const subOption = productData.subOptions[i];

                        // Create option group
                        const [optionGroup] = await tx
                            .insert(productOptionGroups)
                            .values({
                                productId,
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
                                price: Math.round(option.price * 100),
                                displayOrder: idx,
                            }));

                            await tx.insert(productOptions).values(optionsToInsert);
                        }
                    }
                }
            }

            return updatedProduct;
        });

        return { ok: true, data: result };
    } catch (error: any) {
        return {
            ok: false,
            error: {
                code: "INTERNAL",
                message: "Failed to update product",
                details: error?.message ?? String(error),
                status: 500,
            },
        };
    }
}