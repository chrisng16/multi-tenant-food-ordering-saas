"use server";

import { requireUser } from "@/actions/auth/require-user";
import type { DayKey, TimeRange } from "@/components/dashboard/stores/business-hours/time-utils";
import { db } from "@/db";
import type { StoreWeeklyRange } from "@/db/schema";
import { storeWeeklyRanges, stores } from "@/db/schema";
import type { ActionResult } from "@/types/actions/action-result";
import { and, eq } from "drizzle-orm";

export async function updateStoreHours(
    storeId: string,
    dayOfWeek: DayKey,
    ranges: TimeRange[]
): Promise<ActionResult<StoreWeeklyRange[]>> {
    const userRes = await requireUser();
    if (!userRes.ok) return { ok: false, error: userRes.error };

    const { userId } = userRes.data;

    try {
        // Verify store ownership
        const [store] = await db.select().from(stores).where(and(eq(stores.id, storeId), eq(stores.userId, userId)));
        if (!store) return { ok: false as const, error: { code: "NOT_FOUND", message: "Store not found", status: 404 } };

        // Delete existing ranges for this day
        await db.delete(storeWeeklyRanges).where(
            and(eq(storeWeeklyRanges.storeId, storeId), eq(storeWeeklyRanges.dayOfWeek, dayOfWeek as any))
        );

        // Insert new ranges for this day
        const newRanges: (typeof storeWeeklyRanges.$inferInsert)[] = ranges.map((range) => ({
            storeId,
            dayOfWeek: dayOfWeek as any,
            startMin: range.startMin,
            endMin: range.endMin,
        }));

        const result = newRanges.length > 0 ? await db.insert(storeWeeklyRanges).values(newRanges).returning() : [];

        // Return all ranges for this store
        const allRanges = await db.select().from(storeWeeklyRanges).where(eq(storeWeeklyRanges.storeId, storeId));
        return { ok: true as const, data: allRanges };
    } catch (err) {
        console.error("updateStoreHours error", err);
        return { ok: false as const, error: { code: "INTERNAL", message: "Failed to update store hours", status: 500 } };
    }
}
