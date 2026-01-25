"use server";

import { requireUser } from "@/actions/auth/require-user";
import { db } from "@/db";
import { Store, stores } from "@/db/schema";
import type { ActionResult } from "@/types/actions/action-result";
import { eq } from "drizzle-orm";

export async function getAllStores(): Promise<ActionResult<Store[]>> {
    const userRes = await requireUser();
    if (!userRes.ok) return { ok: false, error: userRes.error };

    const { userId } = userRes.data;

    try {
        const rows = await db.select().from(stores).where(eq(stores.userId, userId));
        if (!rows.length) return { ok: false, error: { code: "NOT_FOUND", message: "Store not found", status: 404 } };
        return { ok: true, data: rows };
    } catch (err) {
        console.error("getStore error", err);
        return { ok: false, error: { code: "INTERNAL", message: "Failed to fetch store", status: 500 } };
    }
}
