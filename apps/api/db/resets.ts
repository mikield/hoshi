import { db } from './connection'

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
