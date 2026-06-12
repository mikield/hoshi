import { findInvite, isInviteExpired } from '../../db/invites'
import { findOrganization } from '../../db/orgs'
import { findUserById } from '../../db/users'

/** Public invite preview — enough to render the accept page, nothing sensitive. */
export default defineEventHandler((event) => {
  const token = getRouterParam(event, 'token')!
  const invite = findInvite(token)
  if (!invite || isInviteExpired(invite)) {
    throw createError({ statusCode: 404, statusMessage: 'This invite is invalid or has expired.' })
  }
  const organization = findOrganization(invite.org_id)
  const inviter = findUserById(invite.invited_by)
  return {
    invite: {
      email: invite.email,
      role: invite.role,
      organization: organization?.name ?? 'an organization',
      invitedBy: inviter?.name || inviter?.email || 'a member',
    },
  }
})
