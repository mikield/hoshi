import { db } from './connection'

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
