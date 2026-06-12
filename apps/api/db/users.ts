import { db } from './connection'

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
