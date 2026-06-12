import { getMembership, updateMemberRole } from '../../../../db/orgs'
import { requireMembership } from '../../../../utils/orgs'

/** Change a member's role. Owners are immutable here — ownership doesn't transfer via this route. */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'id')!
  const userId = Number(getRouterParam(event, 'userId'))
  await requireMembership(event, orgId, 'admin')

  const { role } = await readJsonBody<{ role?: unknown }>(event)
  if (role !== 'admin' && role !== 'member') {
    throw createError({ statusCode: 400, statusMessage: 'Role must be admin or member.' })
  }

  const target = getMembership(orgId, userId)
  if (!target) throw createError({ statusCode: 404, statusMessage: 'Member not found.' })
  if (target.role === 'owner') {
    throw createError({ statusCode: 400, statusMessage: "The owner's role can't be changed." })
  }

  updateMemberRole(orgId, userId, role)
  return { ok: true }
})
