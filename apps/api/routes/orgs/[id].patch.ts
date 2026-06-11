import { renameOrganization } from '../../utils/db'
import { requireMembership } from '../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireMembership(event, id, 'admin')
  const { name } = await readBody<{ name?: unknown }>(event)
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Enter an organization name (1–120 characters).' })
  }
  return { organization: renameOrganization(id, name.trim()) }
})
