import bcrypt from 'bcryptjs'
import { deletePasswordReset, findPasswordReset } from '../../db/resets'
import { findUserById, updateUserPassword } from '../../db/users'
import { createSessionCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const { token, password } = await readBody<{ token?: unknown; password?: unknown }>(event)

  if (typeof password !== 'string' || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Choose a password with at least 8 characters.' })
  }

  const reset = typeof token === 'string' ? findPasswordReset(token) : undefined
  const user = reset && findUserById(reset.user_id)
  if (!reset || !user) {
    throw createError({ statusCode: 400, statusMessage: 'This reset link is invalid or has expired.' })
  }

  updateUserPassword(user.id, await bcrypt.hash(password, 10))
  deletePasswordReset(reset.token)

  // Fresh password proves ownership — sign them straight in.
  await createSessionCookie(event, { userId: user.id, email: user.email })
  return { user: { id: user.id, email: user.email, name: user.name } }
})
