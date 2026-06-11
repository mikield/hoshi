import Database from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const globalForDb = globalThis as unknown as { __db?: Database.Database }

export const db = globalForDb.__db ?? new Database(path.join(dataDir, 'app.db'))
globalForDb.__db = db

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    is_admin INTEGER NOT NULL DEFAULT 0,
    disabled INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS instance_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS organization_members (
    org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (org_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS invites (
    token TEXT PRIMARY KEY,
    org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    invited_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS password_resets (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS group_members (
    group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (group_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS project_sessions (
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    oc_session_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (project_id, oc_session_id)
  );
`)

// ── One-time migration: admin & disabled flags on users ─────────────────────
// Pre-admin databases lack the columns; the earliest account becomes the
// instance admin so the panel is reachable without manual SQL.
{
  const userColumns = (db.prepare('PRAGMA table_info(users)').all() as Array<{ name: string }>).map(
    (column) => column.name,
  )
  if (!userColumns.includes('is_admin')) db.exec('ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0')
  if (!userColumns.includes('disabled')) db.exec('ALTER TABLE users ADD COLUMN disabled INTEGER NOT NULL DEFAULT 0')

  const hasAdmin = db.prepare('SELECT 1 FROM users WHERE is_admin = 1 LIMIT 1').get()
  if (!hasAdmin) {
    db.prepare('UPDATE users SET is_admin = 1 WHERE id = (SELECT MIN(id) FROM users)').run()
  }
}

// ── One-time migration: org-scoped projects ──────────────────────────────────
// Pre-organizations databases keyed projects by user only. Give every user a
// personal organization and attach their existing projects to it.
{
  const hasOrgColumn = (db.prepare('PRAGMA table_info(projects)').all() as Array<{ name: string }>).some(
    (column) => column.name === 'org_id',
  )
  if (!hasOrgColumn) db.exec('ALTER TABLE projects ADD COLUMN org_id TEXT REFERENCES organizations(id)')

  const orphanedUsers = db
    .prepare(
      `SELECT id, email, name FROM users u
       WHERE NOT EXISTS (SELECT 1 FROM organization_members m WHERE m.user_id = u.id)`,
    )
    .all() as Array<{ id: number; email: string; name: string | null }>

  for (const user of orphanedUsers) {
    const org = createOrganization(personalOrgName(user.name, user.email))
    addMember(org.id, user.id, 'owner')
    db.prepare('UPDATE projects SET org_id = ? WHERE user_id = ? AND org_id IS NULL').run(org.id, user.id)
  }
}

export function personalOrgName(name: string | null, email: string): string {
  return `${name?.trim() || email.split('@')[0]}'s Organization`
}

// ── Users ────────────────────────────────────────────────────────────────────

export interface User {
  id: number
  email: string
  password_hash: string
  name: string | null
  is_admin: number
  disabled: number
  created_at: string
}

export function findUserByEmail(email: string): User | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined
}

export function findUserById(id: number): User | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined
}

export function updateUserName(id: number, name: string | null): User | undefined {
  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, id)
  return findUserById(id)
}

export function createUser(email: string, passwordHash: string, name: string | null): User {
  const result = db
    .prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)')
    .run(email, passwordHash, name)
  return findUserById(result.lastInsertRowid as number)!
}

export function updateUserPassword(id: number, passwordHash: string): void {
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, id)
}

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

// ── Password resets ──────────────────────────────────────────────────────────

export interface PasswordResetRow {
  token: string
  user_id: number
  created_at: string
  expires_at: string
}

/** One live reset per user — requesting again replaces the previous token. */
export function createPasswordReset(userId: number): PasswordResetRow {
  db.prepare('DELETE FROM password_resets WHERE user_id = ?').run(userId)
  const token = crypto.randomUUID()
  db.prepare(
    "INSERT INTO password_resets (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+30 minutes'))",
  ).run(token, userId)
  return db.prepare('SELECT * FROM password_resets WHERE token = ?').get(token) as PasswordResetRow
}

export function findPasswordReset(token: string): PasswordResetRow | undefined {
  return db
    .prepare("SELECT * FROM password_resets WHERE token = ? AND expires_at > datetime('now')")
    .get(token) as PasswordResetRow | undefined
}

export function deletePasswordReset(token: string): void {
  db.prepare('DELETE FROM password_resets WHERE token = ?').run(token)
}

// ── Organizations & membership ───────────────────────────────────────────────

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

// ── Projects (org-scoped; user_id records the creator) ──────────────────────

export interface ProjectRow {
  id: string
  user_id: number
  org_id: string
  name: string
  created_at: string
  updated_at: string
}

export function listProjects(orgId: string): ProjectRow[] {
  return db
    .prepare('SELECT * FROM projects WHERE org_id = ? ORDER BY updated_at DESC')
    .all(orgId) as ProjectRow[]
}

export function findProject(id: string): ProjectRow | undefined {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as ProjectRow | undefined
}

export function createProject(orgId: string, creatorId: number, name: string): ProjectRow {
  const id = crypto.randomUUID()
  db.prepare('INSERT INTO projects (id, org_id, user_id, name) VALUES (?, ?, ?, ?)').run(id, orgId, creatorId, name)
  return findProject(id)!
}

export function renameProject(id: string, name: string): ProjectRow | undefined {
  db.prepare("UPDATE projects SET name = ?, updated_at = datetime('now') WHERE id = ?").run(name, id)
  return findProject(id)
}

export function deleteProject(id: string): boolean {
  return db.prepare('DELETE FROM projects WHERE id = ?').run(id).changes > 0
}

/** Bump updated_at so "recently active" ordering reflects session activity. */
export function touchProject(id: string): void {
  db.prepare("UPDATE projects SET updated_at = datetime('now') WHERE id = ?").run(id)
}

// ── Project ↔ OpenCode session mapping ──────────────────────────────────────

export function listProjectSessionIds(projectId: string): string[] {
  return (
    db.prepare('SELECT oc_session_id FROM project_sessions WHERE project_id = ?').all(projectId) as Array<{
      oc_session_id: string
    }>
  ).map((row) => row.oc_session_id)
}

export function addProjectSession(projectId: string, ocSessionId: string): void {
  db.prepare(
    'INSERT OR IGNORE INTO project_sessions (project_id, oc_session_id) VALUES (?, ?)',
  ).run(projectId, ocSessionId)
}

export function removeProjectSession(projectId: string, ocSessionId: string): void {
  db.prepare('DELETE FROM project_sessions WHERE project_id = ? AND oc_session_id = ?').run(
    projectId,
    ocSessionId,
  )
}
