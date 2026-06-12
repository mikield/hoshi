import { db } from './connection'

// ── Machines ─────────────────────────────────────────────────────────────────
// Every user has their own cloud machine running OpenCode (docs/ARCHITECTURE.md).

export type MachineStatus = 'provisioning' | 'ready' | 'error' | 'offline'

export interface MachineRow {
  id: string
  user_id: number
  name: string
  upstream_url: string
  status: MachineStatus
  created_at: string
  updated_at: string
}

export function getMachineForUser(userId: number): MachineRow | undefined {
  return db.prepare('SELECT * FROM machines WHERE user_id = ?').get(userId) as MachineRow | undefined
}

export function createMachine(userId: number, name: string, upstreamUrl: string): MachineRow {
  const id = crypto.randomUUID()
  db.prepare('INSERT INTO machines (id, user_id, name, upstream_url) VALUES (?, ?, ?, ?)').run(
    id,
    userId,
    name,
    upstreamUrl,
  )
  return getMachineForUser(userId)!
}

export function updateMachine(
  userId: number,
  fields: Partial<Pick<MachineRow, 'name' | 'upstream_url' | 'status'>>,
): MachineRow | undefined {
  const machine = getMachineForUser(userId)
  if (!machine) return undefined
  db.prepare(
    "UPDATE machines SET name = ?, upstream_url = ?, status = ?, updated_at = datetime('now') WHERE user_id = ?",
  ).run(
    fields.name ?? machine.name,
    fields.upstream_url ?? machine.upstream_url,
    fields.status ?? machine.status,
    userId,
  )
  return getMachineForUser(userId)
}
