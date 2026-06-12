import { requireAuth } from '../../utils/auth'
import { findSchedule, updateSchedule } from '../../db/triggers'
import { scheduleToApi } from '../../utils/triggers'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const schedule = findSchedule(id)
  if (!schedule || schedule.user_id !== session.userId) {
    throw createError({ statusCode: 404, statusMessage: 'Schedule not found.' })
  }

  const body = await readBody<{ name?: unknown; prompt?: unknown; intervalMinutes?: unknown; enabled?: unknown }>(event)
  const fields: Parameters<typeof updateSchedule>[1] = {}

  if (typeof body.name === 'string' && body.name.trim()) fields.name = body.name.trim().slice(0, 120)
  if (typeof body.prompt === 'string' && body.prompt.trim()) fields.prompt = body.prompt.trim().slice(0, 4000)
  if (typeof body.intervalMinutes === 'number' && Number.isInteger(body.intervalMinutes)) {
    fields.interval_minutes = Math.min(Math.max(body.intervalMinutes, 5), 60 * 24 * 30)
  }
  if (typeof body.enabled === 'boolean') fields.enabled = body.enabled ? 1 : 0

  return { schedule: scheduleToApi(updateSchedule(id, fields)!) }
})
