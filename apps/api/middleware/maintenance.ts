import { getMaintenance } from '../utils/admin'
import { getAuthSession } from '../utils/session'
import { findUserById } from '../db/users'

/** Paths that stay reachable during maintenance: health checks, the admin
 *  panel itself, and auth — admins must be able to sign in to lift it. */
const EXEMPT = /^\/(health|auth\/|admin\/?)/

export default defineEventHandler(async (event) => {
  if (event.method === 'OPTIONS') return
  if (!getMaintenance().enabled) return
  if (EXEMPT.test(event.path)) return

  const session = await getAuthSession(event)
  if (session && findUserById(session.userId)?.is_admin) return

  const { message } = getMaintenance()
  throw createError({
    statusCode: 503,
    statusMessage: message || 'Hoshi is down for maintenance — back shortly.',
  })
})
