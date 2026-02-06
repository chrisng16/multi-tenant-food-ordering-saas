import { ErrorContext } from "better-auth/react"
import { toast } from "sonner"

export async function handleAuthError(ctx: ErrorContext) {
    switch (ctx.error.status) {
        case 401:
            toast.error("Unauthorized: Invalid email or password.")
            break
        case 403:
            toast.error("You have not verified your email. Please verify to continue.")
            break
        case 404:
            toast.error("Account not found.")
            break
        case 500:
            toast.error("Server error. Please try again later.")
            break
        default:
            toast.error(ctx.error.message || "An unknown error occurred.")
            break
    }
}
