import { db } from './connection'
import { addMember, createOrganization, personalOrgName } from './orgs'

/** One-time schema/data migrations — run once at server start
 *  (plugins/database.ts) before any request is handled. */
export function runMigrations(): void {
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
}
