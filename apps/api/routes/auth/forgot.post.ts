import { createPasswordReset } from '../../db/resets'
import { findUserByEmail } from '../../db/users'

const APP_URL = process.env.APP_URL ?? 'http://localhost:3000'

/** Always answers ok — whether the account exists is never disclosed. Until
 *  SMTP is configured the reset link goes to the server log instead of email. */
export default defineEventHandler(async (event) => {
  const { email } = await readBody<{ email?: unknown }>(event)
  if (typeof email !== 'string' || !email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid email address.' })
  }

  const user = findUserByEmail(email.trim().toLowerCase())
  if (user) {
    const reset = createPasswordReset(user.id)
    const link = `${APP_URL}/reset-password?token=${reset.token}`
    console.info(`[auth] Password reset for ${user.email}: ${link}`)
    // No SMTP yet — outside production the link is handed back so the flow
    // stays usable. Email delivery replaces this branch, not the flow.
    if (process.env.NODE_ENV !== 'production') return { ok: true, devLink: link }
  }

  return { ok: true }
})
