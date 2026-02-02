"use server"
import { db } from "@/db";
import { products } from "@/db/schema";
import { ActionResult } from "@/types/actions/action-result";
import { and, eq } from "drizzle-orm";
import { verifyOwnership } from "../auth/verify-ownership";

export async function deleteProduct(
    storeId: string,
    productId: string
): Promise<ActionResult<{ id: string }>> {
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

        // Delete product (cascading will handle option groups and options)
        await db.delete(products).where(eq(products.id, productId));

        return { ok: true, data: { id: productId } };
    } catch (error: any) {
        return {
            ok: false,
            error: {
                code: "INTERNAL",
                message: "Failed to delete product",
                details: error?.message ?? String(error),
                status: 500,
            },
        };
    }
}