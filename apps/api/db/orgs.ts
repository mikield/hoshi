import { db } from './connection'

// ── Organizations & membership ───────────────────────────────────────────────

export function personalOrgName(name: string | null, email: string): string {
  return `${name?.trim() || email.split('@')[0]}'s Organization`
}

export type OrgRole = 'owner' | 'admin' | 'member'

export interface OrganizationRow {
  id: string
  name: string
  created_at: string
}

export interface MemberRow {
  user_id: number
  email: string
  name: string | null
  role: OrgRole
  created_at: string
}

export function createOrganization(name: string): OrganizationRow {
  const id = crypto.randomUUID()
  db.prepare('INSERT INTO organizations (id, name) VALUES (?, ?)').run(id, name)
  return db.prepare('SELECT * FROM organizations WHERE id = ?').get(id) as OrganizationRow
}

export function findOrganization(id: string): OrganizationRow | undefined {
  return db.prepare('SELECT * FROM organizations WHERE id = ?').get(id) as OrganizationRow | undefined
}

export function renameOrganization(id: string, name: string): OrganizationRow | undefined {
  db.prepare('UPDATE organizations SET name = ? WHERE id = ?').run(name, id)
  return findOrganization(id)
}

export function deleteOrganization(id: string): boolean {
  return db.prepare('DELETE FROM organizations WHERE id = ?').run(id).changes > 0
}

export function listOrganizationsForUser(
  userId: number,
): Array<OrganizationRow & { role: OrgRole; member_count: number }> {
  return db
    .prepare(
      `SELECT o.*, m.role,
              (SELECT COUNT(*) FROM organization_members c WHERE c.org_id = o.id) AS member_count
       FROM organizations o
       JOIN organization_members m ON m.org_id = o.id AND m.user_id = ?
       ORDER BY o.created_at ASC`,
    )
    .all(userId) as Array<OrganizationRow & { role: OrgRole; member_count: number }>
}

export function getMembership(orgId: string, userId: number): { role: OrgRole } | undefined {
  return db
    .prepare('SELECT role FROM organization_members WHERE org_id = ? AND user_id = ?')
    .get(orgId, userId) as { role: OrgRole } | undefined
}

export function addMember(orgId: string, userId: number, role: OrgRole): void {
  db.prepare(
    'INSERT OR IGNORE INTO organization_members (org_id, user_id, role) VALUES (?, ?, ?)',
  ).run(orgId, userId, role)
}

export function listMembers(orgId: string): MemberRow[] {
  return db
    .prepare(
      `SELECT m.user_id, u.email, u.name, m.role, m.created_at
       FROM organization_members m
       JOIN users u ON u.id = m.user_id
       WHERE m.org_id = ?
       ORDER BY m.created_at ASC`,
    )
    .all(orgId) as MemberRow[]
}

export function updateMemberRole(orgId: string, userId: number, role: OrgRole): boolean {
  return (
    db.prepare('UPDATE organization_members SET role = ? WHERE org_id = ? AND user_id = ?').run(role, orgId, userId)
      .changes > 0
  )
}

export function removeMember(orgId: string, userId: number): boolean {
  return (
    db.prepare('DELETE FROM organization_members WHERE org_id = ? AND user_id = ?').run(orgId, userId).changes > 0
  )
}
