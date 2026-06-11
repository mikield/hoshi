import { addMember, createOrganization } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const { name } = await readBody<{ name?: unknown }>(event)
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Enter an organization name (1–120 characters).' })
  }
  const organization = createOrganization(name.trim())
  addMember(organization.id, session.userId, 'owner')
  return { organization: { ...organization, role: 'owner', member_count: 1 } }
})
