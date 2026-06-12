import bcrypt from 'bcryptjs'
import { findUserByEmail } from '../../db/users'
import { createSessionCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email?: unknown; password?: unknown }>(event)

  if (typeof email !== 'string' || typeof password !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'Enter your email and password.' }
  }

  const user = findUserByEmail(email.trim().toLowerCase())
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    setResponseStatus(event, 401)
    return { error: 'Incorrect email or password.' }
  }

  if (user.disabled) {
    setResponseStatus(event, 403)
    return { error: 'This account has been disabled by an administrator.' }
  }

  await createSessionCookie(event, { userId: user.id, email: user.email })
  return { user: { id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === 1 } }
})
