"use server";

import { requireUser } from "@/actions/auth/require-user";
import { db } from "@/db";
import { Store, stores } from "@/db/schema";
import { StoreSchema } from "@/schemas/store";
import type { ActionResult } from "@/types/actions/action-result";
import { and, eq } from "drizzle-orm";

export async function updateStore(storeId: string, payload: StoreSchema): Promise<ActionResult<Store>> {
    const userRes = await requireUser();
    if (!userRes.ok) return { ok: false, error: userRes.error };

    const { userId } = userRes.data;

    try {
        const [updated] = await db
            .update(stores)
            .set({ ...payload })
            .where(and(eq(stores.id, storeId), eq(stores.userId, userId)))
            .returning();

        if (!updated) return { ok: false as const, error: { code: "NOT_FOUND", message: "Store not found or no permission", status: 404 } };

        return { ok: true as const, data: updated };
    } catch (err) {
        console.error("updateStore error", err);
        return { ok: false as const, error: { code: "INTERNAL", message: "Failed to update store", status: 500 } };
    }
}
