import { deleteOrganization, listOrganizationsForUser } from '../../db/orgs'
import { requireMembership } from '../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const { session } = await requireMembership(event, id, 'owner')
  if (listOrganizationsForUser(session.userId).length <= 1) {
    throw createError({ statusCode: 400, statusMessage: "You can't delete your only organization." })
  }
  deleteOrganization(id)
  return { ok: true }
})
