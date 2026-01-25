"use server";

import { requireUser } from "@/actions/auth/require-user";
import { db } from "@/db";
import { Store, stores } from "@/db/schema";
import type { ActionResult } from "@/types/actions/action-result";
import { and, eq } from "drizzle-orm";

export async function deleteStore(storeId: string): Promise<ActionResult<Store>> {
    const userRes = await requireUser();
    if (!userRes.ok) return { ok: false, error: userRes.error };

    const { userId } = userRes.data;

    try {
        const deleted = await db.delete(stores).where(and(eq(stores.id, storeId), eq(stores.userId, userId))).returning();
        if (!deleted) return { ok: false as const, error: { code: "NOT_FOUND", message: "Store not found or no permission", status: 404 } };
        return { ok: true as const, data: deleted[0] };
    } catch (err) {
        console.error("deleteStore error", err);
        return { ok: false as const, error: { code: "INTERNAL", message: "Failed to delete store", status: 500 } };
    }
}
