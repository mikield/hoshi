import { deleteInvite, findInvite } from '../../../../utils/db'
import { requireMembership } from '../../../../utils/orgs'

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'id')!
  await requireMembership(event, orgId, 'admin')
  const token = getRouterParam(event, 'token')!
  const invite = findInvite(token)
  if (!invite || invite.org_id !== orgId) {
    throw createError({ statusCode: 404, statusMessage: 'Invite not found.' })
  }
  deleteInvite(token)
  return { ok: true }
})
