import { createInvite, listInvites } from '../../../db/invites'
import { getMembership } from '../../../db/orgs'
import { findUserByEmail } from '../../../db/users'
import { requireMembership } from '../../../utils/orgs'

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'id')!
  const { session } = await requireMembership(event, orgId, 'admin')

  const { email, role } = await readBody<{ email?: unknown; role?: unknown }>(event)
  if (typeof email !== 'string' || !email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid email address.' })
  }
  if (role !== 'admin' && role !== 'member') {
    throw createError({ statusCode: 400, statusMessage: 'Role must be admin or member.' })
  }

  const normalized = email.trim().toLowerCase()
  const existing = findUserByEmail(normalized)
  if (existing && getMembership(orgId, existing.id)) {
    throw createError({ statusCode: 409, statusMessage: 'That person is already a member.' })
  }
  if (listInvites(orgId).some((invite) => invite.email === normalized)) {
    throw createError({ statusCode: 409, statusMessage: 'There is already a pending invite for that email.' })
  }

  return { invite: createInvite(orgId, normalized, role, session.userId) }
})
