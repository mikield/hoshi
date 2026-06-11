export interface Project {
  id: string
  name: string
  created_at: string
  updated_at: string
}

// State lives in stores/projects.ts — this file holds the project domain
// type, the session-mapping API helpers, and the timestamp utilities.

// ── Project ↔ OpenCode session mapping ──────────────────────────────────────

export async function fetchProjectSessionIds(projectId: string): Promise<Set<string>> {
  const res = await useApi()<{ sessionIds: string[] }>(`/projects/${projectId}/sessions`)
  return new Set(res.sessionIds)
}

export async function registerProjectSession(projectId: string, sessionId: string): Promise<void> {
  await useApi()(`/projects/${projectId}/sessions`, { method: 'POST', body: { sessionId } })
}

export async function unregisterProjectSession(projectId: string, sessionId: string): Promise<void> {
  await useApi()(`/projects/${projectId}/sessions/${sessionId}`, { method: 'DELETE' })
}

/** "2 minutes" → "2m" style compact relative time, from a timestamp. */
export function shortRelative(ts: number | undefined, now: number): string {
  if (!ts) return ''
  const diff = Math.max(0, now - ts)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return `${Math.max(1, Math.floor(diff / 1000))}s`
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo`
  return `${Math.floor(months / 12)}y`
}

/** SQLite's datetime('now') is UTC without a zone suffix — parse accordingly. */
export function sqliteTimestamp(value: string): number {
  return new Date(`${value.replace(' ', 'T')}Z`).getTime()
}
