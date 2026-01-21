// src/lib/unwrap-action-result.ts
import type { ActionResult } from "@/types/actions/action-result";
import { ClientActionError } from "./client-action-error";

export function unwrapActionResult<T>(res: ActionResult<T>): T {
    if (res.ok) return res.data;
    throw new ClientActionError(res.error);
}
