import bcrypt from 'bcryptjs'
import { requireAuth } from '../../utils/auth'
import { findUserById } from '../../utils/db'

/** Confirm the signed-in user's password to dismiss the inactivity lock —
 *  validates without reissuing the session cookie. */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const { password } = await readBody<{ password?: unknown }>(event)

  if (typeof password !== 'string' || password.length === 0) {
    setResponseStatus(event, 400)
    return { error: 'Enter your password.' }
  }

  const user = findUserById(session.userId)
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    setResponseStatus(event, 401)
    return { error: 'Incorrect password.' }
  }

  return { ok: true }
})
