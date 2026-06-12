import { listApiTokens } from '../../db/tokens'
import { requireAuth } from '../../utils/auth'
import { tokenToApi } from '../../utils/tokens'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  return { tokens: listApiTokens(session.userId).map(tokenToApi) }
})
