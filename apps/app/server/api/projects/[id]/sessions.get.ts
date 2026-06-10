import { findProject, listProjectSessionIds } from '../../../utils/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const id = getRouterParam(event, 'id')!
  if (!findProject(session.userId, id)) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found.' })
  }
  return { sessionIds: listProjectSessionIds(id) }
})
