import { requireAuth } from '../../utils/auth'
import { listWebhooksForUser } from '../../db/triggers'
import { webhookToApi } from '../../utils/triggers'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  return { webhooks: listWebhooksForUser(session.userId).map(webhookToApi) }
})
