import type { SessionPayload } from './session'

const DEFAULT_UPSTREAM = process.env.OPENCODE_URL ?? 'http://localhost:4096'

/** Per-tenant seam: today every user shares one OpenCode upstream; later this
 *  resolves the caller's own instance (per workspace, domain, or sandbox). */
export function resolveOpencodeUpstream(_session: SessionPayload): string {
  return DEFAULT_UPSTREAM
}
