"use server";

import { requireUser } from "@/actions/auth/require-user";
import { DAY_ORDER, DayHours, isSameDayHours, TimeRange, WeekHours } from "@/components/dashboard/stores/business-hours/time-utils";
import { db } from "@/db";
import { Store, stores } from "@/db/schema";
import { StoreSchema } from "@/schemas/store";
import type { ActionResult } from "@/types/actions/action-result";
import { and, eq } from "drizzle-orm";
import { setStoreHours } from "./set-store-hours";

export async function updateStore(storeId: string, storeDetails: StoreSchema, hours: WeekHours): Promise<ActionResult<Store>> {
    const userRes = await requireUser();
    if (!userRes.ok) return { ok: false, error: userRes.error };

    const { userId } = userRes.data;

    try {
        // Get existing store
        const existingStore = await db.query.stores.findFirst({
            where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
            with: {
                weeklyRanges: true
            }
        });
        console.log("Existing Store:", existingStore);

        if (!existingStore) return { ok: false, error: { code: "NOT_FOUND", message: "Store not found", status: 404 } };

        // Update store details
        const [u] = await db.update(stores).set({ ...storeDetails }).where(and(eq(stores.id, storeId), eq(stores.userId, userId))).returning();
        if (!u) return { ok: false, error: { code: "NOT_FOUND", message: "Store not found or no permission", status: 404 } };

        // Compare and update weekly hours only if different
        const ranges = existingStore.weeklyRanges

        let hoursDifferent = false;
        for (const day of DAY_ORDER) {
            const dayRows = ranges
                .filter((r: any) => r.dayOfWeek === day)
                .map((r: any) => ({ startMin: r.startMin, endMin: r.endMin })) as TimeRange[];
            const dbDay: DayHours = dayRows.length === 0 ? { status: "closed" } : { status: "ranges", ranges: dayRows };
            const nextDay = hours[day];
            if (!isSameDayHours(dbDay, nextDay)) {
                hoursDifferent = true;
                break;
            }
        }

        if (hoursDifferent) {
            await setStoreHours(storeId, hours);
            console.log("Update date hours")
        }

        const updatedStore = await db.query.stores.findFirst({
            where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
            with: {
                weeklyRanges: true
            }
        });

        if (!updatedStore) {
            return { ok: false, error: { code: "NOT_FOUND", message: "Store not found after update", status: 404 } };
        }

        return { ok: true, data: updatedStore };
    } catch (err) {
        console.error("updateStore error", err);
        return { ok: false, error: { code: "INTERNAL", message: "Failed to update store", status: 500 } };
    }
}
