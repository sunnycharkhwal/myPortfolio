import { env } from '../config/env.js'

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

// Uses Node 20's built-in global fetch — no axios/node-fetch dependency needed.
export async function sendResetEmail(toEmail, rawToken) {
  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`

  const response = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME },
      to: [{ email: toEmail }],
      subject: 'Reset your password',
      htmlContent: `
        <p>Someone requested a password reset for this account.</p>
        <p><a href="${resetLink}">Click here to reset your password</a></p>
        <p>This link expires in ${env.RESET_TOKEN_EXPIRES_MIN} minutes. If you didn't request this, you can ignore this email.</p>
      `,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Brevo send failed: ${response.status} ${body}`)
  }
}
