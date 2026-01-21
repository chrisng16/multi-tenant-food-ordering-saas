// src/lib/client-action-error.ts
import type { ActionError } from "@/types/actions/action-result";

export class ClientActionError extends Error {
    readonly code: ActionError["code"];
    readonly status: number;
    readonly details?: unknown;

    constructor(error: ActionError) {
        super(error.message);
        this.name = "ClientActionError";
        this.code = error.code;
        this.status = error.status;
        this.details = error.details;
    }
}
