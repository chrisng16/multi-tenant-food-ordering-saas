"use server"

import { requireUser } from "@/actions/auth/require-user";
import { db } from "@/db";
import type { ActionResult } from "@/types/actions/action-result";

export async function verifyOwnership(storeId: string): Promise<ActionResult<null>> {
    const userRes = await requireUser();
    if (!userRes.ok) return { ok: false, error: userRes.error };

    const { userId } = userRes.data;

    // Verify store ownership
    const store = await db.query.stores.findFirst({
        where: (stores, { eq, and }) => and(eq(stores.id, storeId), eq(stores.userId, userId)),
    });
    if (!store) {
        return {
            ok: false,
            error: {
                code: "FORBIDDEN",
                message: "No permission",
                status: 403,
            },
        };
    }

    return { ok: true, data: null };
}