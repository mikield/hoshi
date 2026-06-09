import { findUserById } from '../../utils/db'
import { getAuthSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const session = await getAuthSession(event)
  if (!session) return { user: null }

  const user = findUserById(session.userId)
  if (!user) return { user: null }

  return { user: { id: user.id, email: user.email, name: user.name } }
})
