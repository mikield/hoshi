import type { Project } from '~/composables/useProjects'

/** Projects of the active organization. Reloads automatically on org switch. */
export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loaded = ref(false)
  const loading = ref(false)
  const loadError = ref(false)
  /** Shared reference time for relative labels — ticked client-side so "1m" doesn't freeze. */
  const now = ref(Date.now())
  const api = useApi()
  const orgs = useOrganizationsStore()

  let inflight: Promise<void> | null = null
  let ticker: ReturnType<typeof setInterval> | null = null

  if (import.meta.client && !ticker) {
    ticker = setInterval(() => (now.value = Date.now()), 30_000)
  }

  // Switching organizations swaps the whole project list.
  watch(
    () => orgs.current?.id,
    (next, prev) => {
      if (next && prev && next !== prev) load(true)
    },
  )

  function load(force = false): Promise<void> {
    if (loaded.value && !force) return Promise.resolve()
    if (inflight) return inflight
    loading.value = true
    loadError.value = false
    inflight = (async () => {
      try {
        await orgs.load()
        if (!orgs.current) throw new Error('No organization')
        const res = await api<{ projects: Project[] }>('/projects', { query: { org: orgs.current.id } })
        projects.value = res.projects
        loaded.value = true
      } catch {
        // Distinguish "couldn't load" from a genuine empty list.
        loadError.value = true
      } finally {
        loading.value = false
        inflight = null
      }
    })()
    return inflight
  }

  async function create(name: string): Promise<Project> {
    if (!orgs.current) throw new Error('No organization')
    const res = await api<{ project: Project }>('/projects', {
      method: 'POST',
      body: { name, orgId: orgs.current.id },
    })
    projects.value = [res.project, ...projects.value]
    return res.project
  }

  async function rename(id: string, name: string): Promise<void> {
    const res = await api<{ project: Project }>(`/projects/${id}`, { method: 'PATCH', body: { name } })
    projects.value = projects.value.map((p) => (p.id === id ? res.project : p))
  }

  async function remove(id: string): Promise<void> {
    await api(`/projects/${id}`, { method: 'DELETE' })
    projects.value = projects.value.filter((p) => p.id !== id)
  }

  function reset() {
    projects.value = []
    loaded.value = false
    loading.value = false
    loadError.value = false
    inflight = null
  }

  return { projects, loaded, loading, loadError, now, load, create, rename, remove, reset }
})
