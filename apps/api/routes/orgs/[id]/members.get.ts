import { listMembers } from '../../../utils/db'
import { requireMembership } from '../../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireMembership(event, id)
  return { members: listMembers(id) }
})
