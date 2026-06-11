import { listOrganizationsForUser } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  return { organizations: listOrganizationsForUser(session.userId) }
})
