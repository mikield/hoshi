import type { SessionPayload } from './session'
import { ensureMachine } from './machines'

/** Per-user seam: every user works on their own machine, so the proxy
 *  resolves the caller → their machine's OpenCode upstream
 *  (docs/ARCHITECTURE.md). */
export function resolveOpencodeUpstream(session: SessionPayload): string {
  return ensureMachine(session.userId).upstream_url
}
