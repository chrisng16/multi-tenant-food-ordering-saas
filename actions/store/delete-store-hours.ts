"use server";

import { requireUser } from "@/actions/auth/require-user";
import { db } from "@/db";
import { storeWeeklyRanges, stores } from "@/db/schema";
import type { ActionResult } from "@/types/actions/action-result";
import { and, eq } from "drizzle-orm";

export async function deleteStoreHours(storeId: string): Promise<ActionResult<{ deleted: boolean }>> {
    const userRes = await requireUser();
    if (!userRes.ok) return { ok: false, error: userRes.error };

    const { userId } = userRes.data;

    try {
        // Verify store ownership
        const [store] = await db.select().from(stores).where(and(eq(stores.id, storeId), eq(stores.userId, userId)));
        if (!store) return { ok: false as const, error: { code: "NOT_FOUND", message: "Store not found", status: 404 } };

        // Delete all ranges for this store
        await db.delete(storeWeeklyRanges).where(eq(storeWeeklyRanges.storeId, storeId));

        return { ok: true as const, data: { deleted: true } };
    } catch (err) {
        console.error("deleteStoreHours error", err);
        return { ok: false as const, error: { code: "INTERNAL", message: "Failed to delete store hours", status: 500 } };
    }
}
