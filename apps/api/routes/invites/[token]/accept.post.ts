import { addMember, deleteInvite, findInvite, isInviteExpired } from '../../../utils/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const token = getRouterParam(event, 'token')!

  const invite = findInvite(token)
  if (!invite || isInviteExpired(invite)) {
    throw createError({ statusCode: 404, statusMessage: 'This invite is invalid or has expired.' })
  }
  if (invite.email !== session.email.toLowerCase()) {
    throw createError({
      statusCode: 403,
      statusMessage: `This invite was issued for ${invite.email} — sign in with that account to accept it.`,
    })
  }

  addMember(invite.org_id, session.userId, invite.role)
  deleteInvite(token)
  return { ok: true, orgId: invite.org_id }
})
