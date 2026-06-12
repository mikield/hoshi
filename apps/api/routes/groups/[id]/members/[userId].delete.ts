import { removeGroupMember } from '../../../../db/groups'
import { requireGroupAccess } from '../../../../utils/groups'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireGroupAccess(event, id, 'admin')
  removeGroupMember(id, Number(getRouterParam(event, 'userId')))
  return { ok: true }
})
