import { z } from "zod"

const envSchema = z.object({
  SITE_NAME: z.string(),
  SUPPORT_EMAIL: z.email(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
  NEXT_PUBLIC_APP_URL: z.url(),
  VERIFICATION_EXPIRES_MINUTES: z.string().optional(),
  RESET_PASSWORD_EXPIRES_MINUTES: z.string().optional(),
  OTP_EXPIRES_MINUTES: z.string().optional(),
})

export const env = envSchema.parse(process.env)
