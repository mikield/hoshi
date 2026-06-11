import { deleteProject } from '../../utils/db'
import { requireProjectAccess } from '../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireProjectAccess(event, id)
  deleteProject(id)
  return { ok: true }
})
