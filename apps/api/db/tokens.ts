import { createHash, randomBytes } from 'node:crypto'
import { db } from './connection'

// ── Personal access tokens ───────────────────────────────────────────────────
// Bearer credentials for the CLI, API scripts, and the Electron app. Only the
// SHA-256 of the secret is stored — the secret itself is shown once.

export interface ApiTokenRow {
  id: string
  user_id: number
  name: string
  token_hash: string
  prefix: string
  last_used_at: string | null
  created_at: string
}

function hashToken(secret: string): string {
  return createHash('sha256').update(secret).digest('hex')
}

export function createApiToken(userId: number, name: string): { token: ApiTokenRow; secret: string } {
  const id = crypto.randomUUID()
  const secret = `hoshi_${randomBytes(24).toString('hex')}`
  db.prepare('INSERT INTO api_tokens (id, user_id, name, token_hash, prefix) VALUES (?, ?, ?, ?, ?)').run(
    id,
    userId,
    name,
    hashToken(secret),
    secret.slice(0, 12),
  )
  return { token: db.prepare('SELECT * FROM api_tokens WHERE id = ?').get(id) as ApiTokenRow, secret }
}

export function listApiTokens(userId: number): ApiTokenRow[] {
  return db
    .prepare('SELECT * FROM api_tokens WHERE user_id = ? ORDER BY created_at ASC')
    .all(userId) as ApiTokenRow[]
}

export function deleteApiToken(userId: number, id: string): boolean {
  return db.prepare('DELETE FROM api_tokens WHERE id = ? AND user_id = ?').run(id, userId).changes > 0
}

/** Resolve a presented bearer secret to its token row, stamping last use. */
export function findApiTokenBySecret(secret: string): ApiTokenRow | undefined {
  const token = db
    .prepare('SELECT * FROM api_tokens WHERE token_hash = ?')
    .get(hashToken(secret)) as ApiTokenRow | undefined
  if (token) db.prepare("UPDATE api_tokens SET last_used_at = datetime('now') WHERE id = ?").run(token.id)
  return token
}
