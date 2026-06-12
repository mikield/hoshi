import { createApiToken } from '../../db/tokens'
import { requireAuth } from '../../utils/auth'
import { tokenToApi } from '../../utils/tokens'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const { name } = await readBody<{ name?: unknown }>(event)
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a token name (1–120 characters).' })
  }
  const { token, secret } = createApiToken(session.userId, name.trim())
  // The secret crosses the wire exactly once — only its hash is stored.
  return { token: tokenToApi(token), secret }
})
