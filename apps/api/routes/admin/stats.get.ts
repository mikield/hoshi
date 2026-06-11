import { requireAdmin, getMaintenance } from '../../utils/admin'
import { instanceCounts } from '../../utils/db'

const OPENCODE_URL = process.env.OPENCODE_URL ?? 'http://localhost:4096'

/** Reachability + version of the OpenCode upstream, bounded to 1.5s. */
async function opencodeStatus(): Promise<{ reachable: boolean; version: string | null; url: string }> {
  try {
    const res = await fetch(`${OPENCODE_URL}/config`, { signal: AbortSignal.timeout(1500) })
    if (!res.ok) return { reachable: false, version: null, url: OPENCODE_URL }
    const config = (await res.json()) as { version?: string }
    return { reachable: true, version: config.version ?? null, url: OPENCODE_URL }
  } catch {
    return { reachable: false, version: null, url: OPENCODE_URL }
  }
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return {
    counts: instanceCounts(),
    opencode: await opencodeStatus(),
    maintenance: getMaintenance(),
    uptimeSeconds: Math.floor(process.uptime()),
  }
})
