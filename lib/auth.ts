import { db } from "@/db"
import { sendEmail } from "@/lib/email/send-email"
import { env } from "@/lib/env"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { organization } from "better-auth/plugins"
import { emailOTP } from "better-auth/plugins/email-otp"

export const auth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg", usePlural: true }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEmail("resetPassword", { to: user.email, url })
        },
        resetPasswordTokenExpiresIn:
            parseInt(env.RESET_PASSWORD_EXPIRES_MINUTES || "15") * 60,
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: parseInt(env.VERIFICATION_EXPIRES_MINUTES || "15") * 60,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail("verification", { to: user.email, url })
        },
        afterEmailVerification: async (user) => {
            await sendEmail("welcome", { to: user.email, name: user.name })
        },
    },

    plugins: [
        organization({
            schema: {
                organization: {
                    additionalFields: {
                        description: {
                            type: "string",
                            input: true,
                            required: false,
                        },
                    },
                },
            },
        }),
        emailOTP({
            overrideDefaultEmailVerification: false,
            async sendVerificationOTP({ email, otp, type }) {
                await sendEmail("otp", { to: email, token: otp })
            },
            otpLength: 6,
            expiresIn: parseInt(env.OTP_EXPIRES_MINUTES || "5") * 60,
        }),
    ],
})
