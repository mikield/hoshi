import { requireAuth } from '../../utils/auth'
import { findWebhook, updateWebhook } from '../../db/triggers'
import { webhookToApi } from '../../utils/triggers'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const webhook = findWebhook(id)
  if (!webhook || webhook.user_id !== session.userId) {
    throw createError({ statusCode: 404, statusMessage: 'Webhook not found.' })
  }

  const body = await readJsonBody<{ name?: unknown; prompt?: unknown; enabled?: unknown }>(event)
  const fields: Parameters<typeof updateWebhook>[1] = {}

  if (typeof body.name === 'string' && body.name.trim()) fields.name = body.name.trim().slice(0, 120)
  if (typeof body.prompt === 'string' && body.prompt.trim()) fields.prompt = body.prompt.trim().slice(0, 4000)
  if (typeof body.enabled === 'boolean') fields.enabled = body.enabled ? 1 : 0

  return { webhook: webhookToApi(updateWebhook(id, fields)!) }
})
