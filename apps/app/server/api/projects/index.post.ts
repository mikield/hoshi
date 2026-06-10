import { createProject } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const { name } = await readBody<{ name?: unknown }>(event)
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a project name (1–120 characters).' })
  }
  return { project: createProject(session.userId, name.trim()) }
})
