import { db } from './connection'
import type { OrganizationRow } from './orgs'

// ── Instance administration ──────────────────────────────────────────────────

export interface AdminUserRow {
  id: number
  email: string
  name: string | null
  is_admin: number
  disabled: number
  created_at: string
  org_count: number
  project_count: number
}

export function listAllUsers(query?: string): AdminUserRow[] {
  const filter = query ? `WHERE u.email LIKE ? OR u.name LIKE ?` : ''
  const params = query ? [`%${query}%`, `%${query}%`] : []
  return db
    .prepare(
      `SELECT u.id, u.email, u.name, u.is_admin, u.disabled, u.created_at,
              (SELECT COUNT(*) FROM organization_members m WHERE m.user_id = u.id) AS org_count,
              (SELECT COUNT(*) FROM projects p WHERE p.user_id = u.id) AS project_count
       FROM users u ${filter} ORDER BY u.created_at ASC`,
    )
    .all(...params) as AdminUserRow[]
}

export function setUserDisabled(id: number, disabled: boolean): boolean {
  return db.prepare('UPDATE users SET disabled = ? WHERE id = ?').run(disabled ? 1 : 0, id).changes > 0
}

export function setUserAdmin(id: number, isAdmin: boolean): boolean {
  return db.prepare('UPDATE users SET is_admin = ? WHERE id = ?').run(isAdmin ? 1 : 0, id).changes > 0
}

export function deleteUser(id: number): boolean {
  const deleted = db.prepare('DELETE FROM users WHERE id = ?').run(id).changes > 0
  // Orgs whose last member just left are unreachable garbage — sweep them.
  db.prepare(
    'DELETE FROM organizations WHERE id NOT IN (SELECT DISTINCT org_id FROM organization_members)',
  ).run()
  return deleted
}

export interface AdminOrgRow extends OrganizationRow {
  member_count: number
  project_count: number
}

export function listAllOrganizations(): AdminOrgRow[] {
  return db
    .prepare(
      `SELECT o.*,
              (SELECT COUNT(*) FROM organization_members m WHERE m.org_id = o.id) AS member_count,
              (SELECT COUNT(*) FROM projects p WHERE p.org_id = o.id) AS project_count
       FROM organizations o ORDER BY o.created_at ASC`,
    )
    .all() as AdminOrgRow[]
}

export function instanceCounts(): { users: number; organizations: number; projects: number; sessions: number } {
  const count = (sql: string) => (db.prepare(sql).get() as { n: number }).n
  return {
    users: count('SELECT COUNT(*) AS n FROM users'),
    organizations: count('SELECT COUNT(*) AS n FROM organizations'),
    projects: count('SELECT COUNT(*) AS n FROM projects'),
    sessions: count('SELECT COUNT(*) AS n FROM project_sessions'),
  }
}

export function getSetting(key: string): string | null {
  return (db.prepare('SELECT value FROM instance_settings WHERE key = ?').get(key) as { value: string } | undefined)?.value ?? null
}

export function setSetting(key: string, value: string): void {
  db.prepare(
    'INSERT INTO instance_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
  ).run(key, value)
}
