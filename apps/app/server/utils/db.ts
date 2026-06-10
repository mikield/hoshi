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
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
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

export interface User {
  id: number
  email: string
  password_hash: string
  name: string | null
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

// ── Projects ─────────────────────────────────────────────────────────────────

export interface ProjectRow {
  id: string
  user_id: number
  name: string
  created_at: string
  updated_at: string
}

export function listProjects(userId: number): ProjectRow[] {
  return db
    .prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC')
    .all(userId) as ProjectRow[]
}

export function findProject(userId: number, id: string): ProjectRow | undefined {
  return db
    .prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?')
    .get(id, userId) as ProjectRow | undefined
}

export function createProject(userId: number, name: string): ProjectRow {
  const id = crypto.randomUUID()
  db.prepare('INSERT INTO projects (id, user_id, name) VALUES (?, ?, ?)').run(id, userId, name)
  return findProject(userId, id)!
}

export function renameProject(userId: number, id: string, name: string): ProjectRow | undefined {
  db.prepare(
    "UPDATE projects SET name = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?",
  ).run(name, id, userId)
  return findProject(userId, id)
}

export function deleteProject(userId: number, id: string): boolean {
  return db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(id, userId).changes > 0
}

/** Bump updated_at so "recently active" ordering reflects session activity. */
export function touchProject(userId: number, id: string): void {
  db.prepare("UPDATE projects SET updated_at = datetime('now') WHERE id = ? AND user_id = ?").run(id, userId)
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
