import { findWebhookByToken, recordWebhookHit } from '../../utils/db'
import { dispatchPrompt } from '../../utils/dispatch'

/** Public inbound trigger — the unguessable token IS the credential. The
 *  caller's payload is appended to the stored prompt so the agent sees it. */
export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')!
  const webhook = findWebhookByToken(token)
  if (!webhook || webhook.enabled !== 1) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown webhook.' })
  }

  const raw = (await readRawBody(event).catch(() => null))?.slice(0, 16_000)
  const prompt = raw?.trim()
    ? `${webhook.prompt}\n\nIncoming payload:\n\`\`\`\n${raw.trim()}\n\`\`\``
    : webhook.prompt

  let sessionId: string
  try {
    sessionId = await dispatchPrompt(webhook.user_id, `⚡ ${webhook.name}`, prompt, webhook.project_id)
  } catch {
    throw createError({ statusCode: 502, statusMessage: "The owner's machine is unreachable." })
  }

  recordWebhookHit(webhook.id)
  setResponseStatus(event, 202)
  return { ok: true, sessionId }
})
