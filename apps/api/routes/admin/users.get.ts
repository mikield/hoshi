import { requireAdmin } from '../../utils/admin'
import { listAllUsers } from '../../db/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { q } = getQuery(event)
  return { users: listAllUsers(typeof q === 'string' && q.trim() ? q.trim() : undefined) }
})
