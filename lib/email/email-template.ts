import { EmailTemplateType } from "@/types/email"

export function getEmailTemplate(
    type: EmailTemplateType,
    {
        siteName,
        supportEmail,
        name,
        url,
        token,
        expiresIn,
    }: {
        siteName: string
        supportEmail: string
        name?: string
        url?: string
        token?: string
        expiresIn: number
    }
) {
    const greeting = name ? `Hi ${name},` : `Hi,`

    const templates: Record<EmailTemplateType, string> = {
        verification: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>${siteName} Email Verification</h2>
        <p>${greeting}</p>
        <p>Click below to verify your email. This link expires in <b>${expiresIn} minutes</b>.</p>
        <a href="${url}" style="display:inline-block;margin-top:12px;padding:10px 18px;background-color:#0070f3;color:#fff;text-decoration:none;border-radius:6px;">Verify Email</a>
        <p>If you didn’t request this, you can safely ignore it.</p>
        <p>– The ${siteName} Team</p>
        <hr />
        <p>Need help? <a href="mailto:${supportEmail}">${supportEmail}</a></p>
      </div>
    `,
        resetPassword: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>${siteName} Password Reset</h2>
        <p>${greeting}</p>
        <p>Use the link below to reset your password. It expires in <b>${expiresIn} minutes</b>.</p>
        <a href="${url}" style="display:inline-block;margin-top:12px;padding:10px 18px;background-color:#d97706;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a>
        <p>If you didn’t request this, ignore this email.</p>
      </div>
    `,
        otp: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>Your ${siteName} One-Time Code</h2>
        <p>${greeting}</p>
        <p>Your code is below. It expires in <b>${expiresIn} minutes</b>.</p>
        <div style="font-size:24px;font-weight:bold;margin:16px 0;">${token}</div>
      </div>
    `,
        welcome: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>Welcome to ${siteName} 🎉</h2>
        <p>${greeting}</p>
        <p>Your account has been successfully verified. We’re excited to have you with us!</p>
        <p>– The ${siteName} Team</p>
      </div>
    `,
    }

    return templates[type]
}
