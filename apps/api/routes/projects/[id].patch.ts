import { renameProject } from '../../db/projects'
import { requireProjectAccess } from '../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  // Managing org-owned projects is an org-admin action.
  await requireProjectAccess(event, id, 'admin')
  const { name } = await readBody<{ name?: unknown }>(event)
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a project name (1–120 characters).' })
  }
  return { project: renameProject(id, name.trim()) }
})
