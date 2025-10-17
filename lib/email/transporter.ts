import nodemailer from "nodemailer"
import { env } from "@/lib/env"

export const transporter = nodemailer.createTransport({
  pool: true,
  host: env.EMAIL_HOST,
  port: parseInt(env.EMAIL_PORT || "465"),
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
})
