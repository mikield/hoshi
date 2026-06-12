import { listGroups } from '../../../db/groups'
import { requireMembership } from '../../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireMembership(event, id)
  return { groups: listGroups(id) }
})
