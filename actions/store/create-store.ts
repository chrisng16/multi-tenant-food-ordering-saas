"use server";

import { requireUser } from "@/actions/auth/require-user";
import { db } from "@/db";
import { Store, stores } from "@/db/schema";
import { StoreSchema } from "@/schemas/store";
import type { ActionResult } from "@/types/actions/action-result";

export async function createStore(storeData: StoreSchema): Promise<ActionResult<Store>> {
    const userRes = await requireUser();
    if (!userRes.ok) return { ok: false, error: userRes.error };

    const { userId } = userRes.data;

    try {
        const [result] = await db.insert(stores).values({ ...storeData, userId }).returning();
        return { ok: true, data: result };
    } catch (err) {
        console.error("createStore error", err);
        return { ok: false, error: { code: "INTERNAL", message: "Failed to create store", status: 500 } };
    }
}
