import bcrypt from 'bcryptjs'
import { findUserByEmail } from '../../utils/db'
import { createSessionCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email?: unknown; password?: unknown }>(event)

  if (typeof email !== 'string' || typeof password !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'Enter your email and password.' }
  }

  const user = findUserByEmail(email)
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    setResponseStatus(event, 401)
    return { error: 'Incorrect email or password.' }
  }

  await createSessionCookie(event, { userId: user.id, email: user.email })
  return { user: { id: user.id, email: user.email, name: user.name } }
})
