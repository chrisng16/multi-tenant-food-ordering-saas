import { getEmailTemplate } from "@/lib/email/email-template"
import { transporter } from "@/lib/email/transporter"
import { env } from "@/lib/env"
import { EmailTemplateType } from "@/types/email"

interface EmailOptions {
    to: string
    subject?: string
    token?: string
    name?: string
    url?: string
    expiresIn?: number
}

export async function sendEmail(
    type: EmailTemplateType,
    options: EmailOptions
) {
    const siteName = env.SITE_NAME
    const supportEmail = env.SUPPORT_EMAIL
    const expiresIn = options.expiresIn || parseInt(env.VERIFICATION_EXPIRES_MINUTES || "15")

    const subject =
        options.subject ||
        {
            verification: `Verify your email for ${siteName}`,
            resetPassword: `Reset your ${siteName} password`,
            otp: `Your ${siteName} one-time code`,
            welcome: `Welcome to ${siteName}!`,
        }[type]

    const html = getEmailTemplate(type, {
        siteName,
        supportEmail,
        name: options.name,
        token: options.token,
        url: options.url,
        expiresIn,
    })

    await transporter.sendMail({
        from: '"No Reply" <noreply@nsquare.dev>',
        to: options.to,
        subject,
        html,
    })
}
