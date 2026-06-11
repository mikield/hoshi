import { createProject } from '../../utils/db'
import { requireMembership } from '../../utils/orgs'

export default defineEventHandler(async (event) => {
  const { name, orgId } = await readBody<{ name?: unknown; orgId?: unknown }>(event)
  if (typeof orgId !== 'string' || !orgId) {
    throw createError({ statusCode: 400, statusMessage: 'orgId is required.' })
  }
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a project name (1–120 characters).' })
  }
  const { session } = await requireMembership(event, orgId)
  return { project: createProject(orgId, session.userId, name.trim()) }
})
