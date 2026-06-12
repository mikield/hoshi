import { requireAuth } from '../../utils/auth'
import { createWebhook } from '../../db/triggers'
import { requireProjectAccess } from '../../utils/orgs'
import { validateTriggerFields, webhookToApi } from '../../utils/triggers'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const body = await readJsonBody<{ name?: unknown; prompt?: unknown; projectId?: unknown }>(event)
  const { name, prompt } = validateTriggerFields(body.name, body.prompt)

  let projectId: string | null = null
  if (body.projectId != null) {
    if (typeof body.projectId !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'projectId must be a string.' })
    }
    await requireProjectAccess(event, body.projectId)
    projectId = body.projectId
  }

  return { webhook: webhookToApi(createWebhook(session.userId, { name, prompt, projectId })) }
})
