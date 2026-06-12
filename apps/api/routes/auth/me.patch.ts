import { updateUserName } from '../../db/users'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)

  const { name } = await readJsonBody<{ name?: unknown }>(event)
  if (typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 80) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a display name (1–80 characters).' })
  }

  const user = updateUserName(session.userId, name.trim())
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found.' })

  return { user: { id: user.id, email: user.email, name: user.name } }
})
