import { addGroupMember } from '../../../db/groups'
import { getMembership } from '../../../db/orgs'
import { requireGroupAccess } from '../../../utils/groups'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const group = await requireGroupAccess(event, id, 'admin')
  const { userId } = await readBody<{ userId?: unknown }>(event)
  if (typeof userId !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'userId is required.' })
  }
  if (!getMembership(group.org_id, userId)) {
    throw createError({ statusCode: 400, statusMessage: 'That person is not a member of this organization.' })
  }
  addGroupMember(id, userId)
  return { ok: true }
})
