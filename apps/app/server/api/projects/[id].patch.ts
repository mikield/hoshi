import { renameProject } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const { name } = await readBody<{ name?: unknown }>(event)
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a project name (1–120 characters).' })
  }
  const project = renameProject(session.userId, id, name.trim())
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found.' })
  return { project }
})
