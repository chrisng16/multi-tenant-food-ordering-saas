"use server";

import { requireUser } from "@/actions/auth/require-user";
import { WeekHours } from "@/components/dashboard/stores/business-hours/time-utils";
import { db } from "@/db";
import { Store, stores } from "@/db/schema";
import { StoreSchema } from "@/schemas/store";
import type { ActionResult } from "@/types/actions/action-result";
import { checkStoreSlugAvailability } from "./check-store-slug-availability";
import { setStoreHours } from "./set-store-hours";

export async function createStore(storeData: StoreSchema, weekHours: WeekHours): Promise<ActionResult<Store>> {
    const userRes = await requireUser();
    if (!userRes.ok) return { ok: false, error: userRes.error };

    const { userId } = userRes.data;

    try {
        // Ensure slug is available (and not reserved) before inserting
        const slugCheck = await checkStoreSlugAvailability(storeData.slug);
        if (!slugCheck.available) {
            return { ok: false, error: { code: "VALIDATION", message: slugCheck.message || "Slug is unavailable", status: 400 } };
        }
        // const [result] = await db.insert(stores).values({ ...storeData, userId }).returning();
        console.log("createStore storeData, weekHours", storeData, weekHours);
        const [newStore] = await db.insert(stores).values({ ...storeData, userId }).returning();

        const hours = await setStoreHours(newStore.id, weekHours);

        console.log("createStore setStoreHours result", hours);

        return { ok: true, data: newStore };
    } catch (err) {
        console.error("createStore error", (err as Error).message);
        return { ok: false, error: { code: "INTERNAL", message: "Failed to create store", status: 500 } };
    }
}
