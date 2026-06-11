import { createMachine, findUserById, getMachineForUser, type MachineRow } from './db'

const DEFAULT_UPSTREAM = process.env.OPENCODE_URL ?? 'http://localhost:4096'

/** The user's machine, provisioned on first touch. Today provisioning is
 *  instant — a record pointing at the shared upstream; booting a real cloud
 *  machine slots in here without changing any caller. */
export function ensureMachine(userId: number): MachineRow {
  const existing = getMachineForUser(userId)
  if (existing) return existing
  const user = findUserById(userId)
  const owner = user?.name?.trim() || user?.email.split('@')[0] || `user-${userId}`
  return createMachine(userId, `${owner}'s machine`, DEFAULT_UPSTREAM)
}

/** Wire shape for the web/Electron clients. */
export function machineToApi(machine: MachineRow) {
  return {
    id: machine.id,
    name: machine.name,
    upstreamUrl: machine.upstream_url,
    status: machine.status,
    createdAt: machine.created_at,
    updatedAt: machine.updated_at,
  }
}

/** Quick reachability probe against the machine's OpenCode server. */
export async function probeMachine(machine: MachineRow): Promise<boolean> {
  try {
    const res = await fetch(`${machine.upstream_url}/app`, { signal: AbortSignal.timeout(1500) })
    return res.ok
  } catch {
    return false
  }
}
