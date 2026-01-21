"use server";

import { auth } from "@/lib/auth";
import { ActionResult } from "@/types/actions/action-result";
import { headers } from "next/headers";

export async function requireUser(): Promise<ActionResult<{ userId: string }>> {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id;

    if (!userId) return {
        ok: false,
        error: { code: "UNAUTHORIZED", message: "You must sign in to do this action", status: 401 },
    };

    return { ok: true, data: { userId } };
}