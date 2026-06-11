import { requireAuth } from '../../utils/auth'
import { listSchedulesForUser } from '../../utils/db'
import { scheduleToApi } from '../../utils/triggers'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  return { schedules: listSchedulesForUser(session.userId).map(scheduleToApi) }
})
