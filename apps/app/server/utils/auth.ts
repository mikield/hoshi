import type { H3Event } from 'h3'
import { getAuthSession, type SessionPayload } from './session'

/** Resolve the signed-in user or fail the request with 401. */
export async function requireAuth(event: H3Event): Promise<SessionPayload> {
  const session = await getAuthSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Not signed in.' })
  }
  return session
}
