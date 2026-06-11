import { createGroup } from '../../../utils/db'
import { requireMembership } from '../../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireMembership(event, id, 'admin')
  const { name } = await readBody<{ name?: unknown }>(event)
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a group name (1–80 characters).' })
  }
  return { group: createGroup(id, name.trim()) }
})
