import { requireAuth } from '../../utils/auth'
import { deleteSchedule, findSchedule } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const schedule = findSchedule(id)
  if (!schedule || schedule.user_id !== session.userId) {
    throw createError({ statusCode: 404, statusMessage: 'Schedule not found.' })
  }
  deleteSchedule(id)
  return { ok: true }
})
