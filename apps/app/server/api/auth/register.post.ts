import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '../../utils/db'
import { createSessionCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const { email, password, name } = await readBody<{ email?: unknown; password?: unknown; name?: unknown }>(event)

  if (typeof email !== 'string' || typeof password !== 'string' || !email.includes('@') || password.length < 8) {
    setResponseStatus(event, 400)
    return { error: 'Enter a valid email and a password with at least 8 characters.' }
  }

  if (findUserByEmail(email)) {
    setResponseStatus(event, 409)
    return { error: 'An account with this email already exists.' }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = createUser(email, passwordHash, typeof name === 'string' && name.trim() ? name.trim() : null)

  await createSessionCookie(event, { userId: user.id, email: user.email })
  return { user: { id: user.id, email: user.email, name: user.name } }
})
