import { db } from './connection'
import type { OrgRole } from './orgs'

// ── Invites ──────────────────────────────────────────────────────────────────

export interface InviteRow {
  token: string
  org_id: string
  email: string
  role: Exclude<OrgRole, 'owner'>
  invited_by: number
  created_at: string
  expires_at: string
}

const INVITE_TTL_DAYS = 14

export function createInvite(
  orgId: string,
  email: string,
  role: Exclude<OrgRole, 'owner'>,
  invitedBy: number,
): InviteRow {
  const token = crypto.randomUUID()
  db.prepare(
    `INSERT INTO invites (token, org_id, email, role, invited_by, expires_at)
     VALUES (?, ?, ?, ?, ?, datetime('now', '+${INVITE_TTL_DAYS} days'))`,
  ).run(token, orgId, email, role, invitedBy)
  return findInvite(token)!
}

export function findInvite(token: string): InviteRow | undefined {
  return db.prepare('SELECT * FROM invites WHERE token = ?').get(token) as InviteRow | undefined
}

export function isInviteExpired(invite: InviteRow): boolean {
  return new Date(`${invite.expires_at.replace(' ', 'T')}Z`).getTime() < Date.now()
}

/** Pending (unexpired) invites for an organization. */
export function listInvites(orgId: string): InviteRow[] {
  return db
    .prepare(
      "SELECT * FROM invites WHERE org_id = ? AND expires_at > datetime('now') ORDER BY created_at DESC",
    )
    .all(orgId) as InviteRow[]
}

export function deleteInvite(token: string): boolean {
  return db.prepare('DELETE FROM invites WHERE token = ?').run(token).changes > 0
}
