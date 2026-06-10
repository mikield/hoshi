import { addProjectSession, findProject, touchProject } from '../../../utils/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const id = getRouterParam(event, 'id')!
  if (!findProject(session.userId, id)) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found.' })
  }
  const { sessionId } = await readBody<{ sessionId?: unknown }>(event)
  if (typeof sessionId !== 'string' || !sessionId) {
    throw createError({ statusCode: 400, statusMessage: 'sessionId is required.' })
  }
  addProjectSession(id, sessionId)
  touchProject(session.userId, id)
  return { ok: true }
})
