import type { H3Event } from 'h3'
import { createError } from 'h3'
import { requireAuth } from './auth'
import { getSetting, setSetting } from '../db/admin'
import { findUserById, type User } from '../db/users'

/** Resolve the caller as an instance admin or fail with 403. */
export async function requireAdmin(event: H3Event): Promise<User> {
  const session = await requireAuth(event)
  const user = findUserById(session.userId)
  if (!user || !user.is_admin) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required.' })
  }
  return user
}

// ── Maintenance mode ─────────────────────────────────────────────────────────

export interface MaintenanceState {
  enabled: boolean
  message: string | null
}

export function getMaintenance(): MaintenanceState {
  const raw = getSetting('maintenance')
  if (!raw) return { enabled: false, message: null }
  try {
    return JSON.parse(raw) as MaintenanceState
  } catch {
    return { enabled: false, message: null }
  }
}

export function setMaintenance(state: MaintenanceState): void {
  setSetting('maintenance', JSON.stringify(state))
}
