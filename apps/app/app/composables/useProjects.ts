export interface Project {
  id: string
  name: string
  created_at: string
  updated_at: string
}

/** App-lifetime interval keeping the shared `now` fresh — one per client. */
let nowTicker: ReturnType<typeof setInterval> | null = null

/** API-backed project store, shared app-wide via useState. Components call
 *  `load()` once (idempotent) and mutate through the CRUD helpers so every
 *  surface (index page, sidebar switcher, hero) stays in sync. */
export function useProjects() {
  const projects = useState<Project[]>('projects:list', () => [])
  const loaded = useState('projects:loaded', () => false)
  const loading = useState('projects:loading', () => false)
  const loadError = useState('projects:load-error', () => false)
  /** Shared reference time for relative labels. Seeded once (so SSR and the
   *  first client render agree) and ticked client-side so "1m" doesn't freeze. */
  const now = useState('projects:now', () => Date.now())
  if (import.meta.client && !nowTicker) {
    nowTicker = setInterval(() => (now.value = Date.now()), 30_000)
  }

  async function load(force = false) {
    if (loading.value || (loaded.value && !force)) return
    loading.value = true
    loadError.value = false
    try {
      const res = await $fetch<{ projects: Project[] }>('/api/projects')
      projects.value = res.projects
      loaded.value = true
    } catch {
      // Distinguish "couldn't load" from a genuine empty list.
      loadError.value = true
    } finally {
      loading.value = false
    }
  }

  async function create(name: string): Promise<Project> {
    const res = await $fetch<{ project: Project }>('/api/projects', { method: 'POST', body: { name } })
    projects.value = [res.project, ...projects.value]
    return res.project
  }

  async function rename(id: string, name: string): Promise<void> {
    const res = await $fetch<{ project: Project }>(`/api/projects/${id}`, { method: 'PATCH', body: { name } })
    projects.value = projects.value.map((p) => (p.id === id ? res.project : p))
  }

  async function remove(id: string): Promise<void> {
    await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
    projects.value = projects.value.filter((p) => p.id !== id)
  }

  return { projects, loading, loadError, now, load, create, rename, remove }
}

// ── Project ↔ OpenCode session mapping ──────────────────────────────────────

export async function fetchProjectSessionIds(projectId: string): Promise<Set<string>> {
  const res = await $fetch<{ sessionIds: string[] }>(`/api/projects/${projectId}/sessions`)
  return new Set(res.sessionIds)
}

export async function registerProjectSession(projectId: string, sessionId: string): Promise<void> {
  await $fetch(`/api/projects/${projectId}/sessions`, { method: 'POST', body: { sessionId } })
}

export async function unregisterProjectSession(projectId: string, sessionId: string): Promise<void> {
  await $fetch(`/api/projects/${projectId}/sessions/${sessionId}`, { method: 'DELETE' })
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
