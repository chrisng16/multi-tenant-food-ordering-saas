"use server";

import { requireUser } from "@/actions/auth/require-user";
import { db } from "@/db";
import { stores, StoreWithWeeklyRanges } from "@/db/schema";
import type { ActionResult } from "@/types/actions/action-result";
import { and, eq } from "drizzle-orm";

export async function getStore(storeId: string): Promise<ActionResult<StoreWithWeeklyRanges>> {
    const userRes = await requireUser();
    if (!userRes.ok) return { ok: false, error: userRes.error };

    const { userId } = userRes.data;

    try {
        const existingStore = await db.query.stores.findFirst({
            where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
            with: {
                weeklyRanges: true
            }
        });

        if (!existingStore) return { ok: false, error: { code: "NOT_FOUND", message: "Store not found", status: 404 } };
        return { ok: true, data: existingStore };
    } catch (err) {
        console.error("getStore error", err);
        return { ok: false, error: { code: "INTERNAL", message: "Failed to fetch store", status: 500 } };
    }
}
