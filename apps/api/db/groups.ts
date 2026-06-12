import { db } from './connection'
import type { MemberRow } from './orgs'

// ── Groups (bundles of members within an organization) ──────────────────────

export interface GroupRow {
  id: string
  org_id: string
  name: string
  created_at: string
  member_count: number
}

export function listGroups(orgId: string): GroupRow[] {
  return db
    .prepare(
      `SELECT g.*, (SELECT COUNT(*) FROM group_members m WHERE m.group_id = g.id) AS member_count
       FROM groups g WHERE g.org_id = ? ORDER BY g.created_at ASC`,
    )
    .all(orgId) as GroupRow[]
}

export function findGroup(id: string): GroupRow | undefined {
  return db
    .prepare(
      `SELECT g.*, (SELECT COUNT(*) FROM group_members m WHERE m.group_id = g.id) AS member_count
       FROM groups g WHERE g.id = ?`,
    )
    .get(id) as GroupRow | undefined
}

export function createGroup(orgId: string, name: string): GroupRow {
  const id = crypto.randomUUID()
  db.prepare('INSERT INTO groups (id, org_id, name) VALUES (?, ?, ?)').run(id, orgId, name)
  return findGroup(id)!
}

export function renameGroup(id: string, name: string): GroupRow | undefined {
  db.prepare('UPDATE groups SET name = ? WHERE id = ?').run(name, id)
  return findGroup(id)
}

export function deleteGroup(id: string): boolean {
  return db.prepare('DELETE FROM groups WHERE id = ?').run(id).changes > 0
}

export function listGroupMembers(groupId: string): MemberRow[] {
  return db
    .prepare(
      `SELECT m.user_id, u.email, u.name, om.role, m.created_at
       FROM group_members m
       JOIN users u ON u.id = m.user_id
       JOIN groups g ON g.id = m.group_id
       JOIN organization_members om ON om.org_id = g.org_id AND om.user_id = m.user_id
       WHERE m.group_id = ?
       ORDER BY m.created_at ASC`,
    )
    .all(groupId) as MemberRow[]
}

export function addGroupMember(groupId: string, userId: number): void {
  db.prepare('INSERT OR IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)').run(groupId, userId)
}

export function removeGroupMember(groupId: string, userId: number): boolean {
  return db.prepare('DELETE FROM group_members WHERE group_id = ? AND user_id = ?').run(groupId, userId).changes > 0
}
