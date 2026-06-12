import { requireAuth } from '../../utils/auth'
import { createSchedule } from '../../db/triggers'
import { requireProjectAccess } from '../../utils/orgs'
import { scheduleToApi, validateTriggerFields } from '../../utils/triggers'

const MIN_INTERVAL = 5
const MAX_INTERVAL = 60 * 24 * 30

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const body = await readJsonBody<{
    name?: unknown
    prompt?: unknown
    intervalMinutes?: unknown
    projectId?: unknown
  }>(event)

  const { name, prompt } = validateTriggerFields(body.name, body.prompt)

  const interval = Number(body.intervalMinutes)
  if (!Number.isInteger(interval) || interval < MIN_INTERVAL || interval > MAX_INTERVAL) {
    throw createError({
      statusCode: 400,
      statusMessage: `The interval must be ${MIN_INTERVAL}–${MAX_INTERVAL} minutes.`,
    })
  }

  let projectId: string | null = null
  if (body.projectId != null) {
    if (typeof body.projectId !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'projectId must be a string.' })
    }
    await requireProjectAccess(event, body.projectId)
    projectId = body.projectId
  }

  return {
    schedule: scheduleToApi(createSchedule(session.userId, { name, prompt, intervalMinutes: interval, projectId })),
  }
})
