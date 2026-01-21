// src/actions/server/lib/action-result.ts
export type ActionErrorCode =
    | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND"
    | "VALIDATION" | "CONFLICT" | "INTERNAL";

export type ActionError = {
    code: ActionErrorCode;
    message: string;
    status: number;
    details?: unknown;
};

export type ActionResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: ActionError };
