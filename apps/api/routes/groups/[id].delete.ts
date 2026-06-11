import { deleteGroup } from '../../utils/db'
import { requireGroupAccess } from '../../utils/groups'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireGroupAccess(event, id, 'admin')
  deleteGroup(id)
  return { ok: true }
})
