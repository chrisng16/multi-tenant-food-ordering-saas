"use server";

import { db } from "@/db";
import { FullProduct, products } from "@/db/schema";
import type { ActionResult } from "@/types/actions/action-result";
import { eq } from "drizzle-orm";

export async function getProduct(productId: string): Promise<ActionResult<FullProduct>> {
    try {
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
            with: {
                category: true,
                optionGroups: {
                    with: {
                        options: true
                    }
                },
                uploadedImages: true,
            }
        });

        if (!product) {
            return {
                ok: false,
                error: { code: "NOT_FOUND", message: "Product not found", status: 404 },
            };
        }

        return { ok: true, data: product };
    } catch (err) {
        console.error("Error fetching product:", err);
        return {
            ok: false,
            error: { code: "INTERNAL", message: "Failed to fetch product", status: 500 },
        };
    }
}