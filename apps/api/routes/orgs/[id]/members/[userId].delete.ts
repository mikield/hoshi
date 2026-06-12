import { getMembership, removeMember } from '../../../../db/orgs'
import { requireMembership } from '../../../../utils/orgs'

/** Remove a member (admin+), or leave the organization yourself. Owners can't be removed. */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'id')!
  const userId = Number(getRouterParam(event, 'userId'))
  const { session } = await requireMembership(event, orgId)
  if (userId !== session.userId) await requireMembership(event, orgId, 'admin')

  const target = getMembership(orgId, userId)
  if (!target) throw createError({ statusCode: 404, statusMessage: 'Member not found.' })
  if (target.role === 'owner') {
    throw createError({ statusCode: 400, statusMessage: "The owner can't be removed." })
  }

  removeMember(orgId, userId)
  return { ok: true }
})
