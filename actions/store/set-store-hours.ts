"use server";

import type { DayKey, WeekHours } from "@/components/dashboard/stores/business-hours/time-utils";
import { DAY_ORDER } from "@/components/dashboard/stores/business-hours/time-utils";
import { db } from "@/db";
import type { StoreWeeklyRange } from "@/db/schema";
import { storeWeeklyRanges } from "@/db/schema";
import type { ActionResult } from "@/types/actions/action-result";
import { eq } from "drizzle-orm";

export async function setStoreHours(
    storeId: string,
    weekHours: WeekHours
): Promise<ActionResult<StoreWeeklyRange[]>> {
    // const userRes = await requireUser();
    // if (!userRes.ok) return { ok: false, error: userRes.error };

    // const { userId } = userRes.data;

    try {
        // Verify store ownership
        // const [store] = await db.select().from(stores).where(and(eq(stores.id, storeId), eq(stores.userId, userId)));
        // if (!store) return { ok: false as const, error: { code: "NOT_FOUND", message: "Store not found", status: 404 } };

        console.log(weekHours)

        // Delete existing ranges for this store
        await db.delete(storeWeeklyRanges).where(eq(storeWeeklyRanges.storeId, storeId));

        // Insert new ranges
        const ranges: StoreWeeklyRange[] = [];
        for (const day of DAY_ORDER) {
            const dayHours = weekHours[day as DayKey];
            if (dayHours.status === "ranges") {
                console.log("dayHours.ranges", dayHours.ranges);
                for (const range of dayHours.ranges) {
                    ranges.push({
                        storeId,
                        dayOfWeek: day as any,
                        startMin: range.startMin,
                        endMin: range.endMin,
                    });
                }
            }
        }

        const result = ranges.length > 0 ? await db.insert(storeWeeklyRanges).values(ranges).returning() : [];
        return { ok: true as const, data: result };
    } catch (err) {
        console.error("setStoreHours error", err);
        return { ok: false as const, error: { code: "INTERNAL", message: "Failed to set store hours", status: 500 } };
    }
}