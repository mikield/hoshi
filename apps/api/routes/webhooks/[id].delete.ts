import { requireAuth } from '../../utils/auth'
import { deleteWebhook, findWebhook } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const webhook = findWebhook(id)
  if (!webhook || webhook.user_id !== session.userId) {
    throw createError({ statusCode: 404, statusMessage: 'Webhook not found.' })
  }
  deleteWebhook(id)
  return { ok: true }
})
