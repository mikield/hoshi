import { findUserById } from '../../db/users'
import { getAuthSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const session = await getAuthSession(event)
  if (!session) return { user: null }

  const user = findUserById(session.userId)
  if (!user || user.disabled) return { user: null }

  return { user: { id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === 1 } }
})
