import type { H3Event } from 'h3'
import { createError } from 'h3'
import { getAuthSession, type SessionPayload } from './session'
import { findUserById } from '../db/users'

/** Resolve the signed-in user or fail the request with 401. Disabled accounts
 *  are rejected immediately, so an admin lockout takes effect mid-session. */
export async function requireAuth(event: H3Event): Promise<SessionPayload> {
  const session = await getAuthSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Not signed in.' })
  }
  if (findUserById(session.userId)?.disabled) {
    throw createError({ statusCode: 403, statusMessage: 'This account is disabled.' })
  }
  return session
}
