import { listGroupMembers } from '../../../db/groups'
import { requireGroupAccess } from '../../../utils/groups'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireGroupAccess(event, id)
  return { members: listGroupMembers(id) }
})
