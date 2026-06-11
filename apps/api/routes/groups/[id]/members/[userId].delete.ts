import { removeGroupMember } from '../../../../utils/db'
import { requireGroupAccess } from '../../../../utils/groups'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireGroupAccess(event, id, 'admin')
  removeGroupMember(id, Number(getRouterParam(event, 'userId')))
  return { ok: true }
})
