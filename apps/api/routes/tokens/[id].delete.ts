import { deleteApiToken } from '../../db/tokens'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const id = getRouterParam(event, 'id')!
  if (!deleteApiToken(session.userId, id)) {
    throw createError({ statusCode: 404, statusMessage: 'Token not found.' })
  }
  return { ok: true }
})
