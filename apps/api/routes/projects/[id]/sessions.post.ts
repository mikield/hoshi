import { addProjectSession, touchProject } from '../../../db/projects'
import { requireProjectAccess } from '../../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireProjectAccess(event, id)
  const { sessionId } = await readJsonBody<{ sessionId?: unknown }>(event)
  if (typeof sessionId !== 'string' || !sessionId) {
    throw createError({ statusCode: 400, statusMessage: 'sessionId is required.' })
  }
  addProjectSession(id, sessionId)
  touchProject(id)
  return { ok: true }
})
