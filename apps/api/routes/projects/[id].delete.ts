import { deleteProject } from '../../db/projects'
import { requireProjectAccess } from '../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  // Managing org-owned projects is an org-admin action.
  await requireProjectAccess(event, id, 'admin')
  deleteProject(id)
  return { ok: true }
})
