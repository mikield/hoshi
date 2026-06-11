import type { Organization } from '~/composables/useOrganizations'

/** Organizations and the active org (persisted in a cookie so SSR agrees). */
export const useOrganizationsStore = defineStore('organizations', () => {
  const organizations = ref<Organization[]>([])
  const loaded = ref(false)
  const loading = ref(false)
  const currentOrgId = useCookie<string | null>('hoshi-org', { default: () => null })
  const api = useApi()

  /** Coalesces concurrent load() calls — awaiting callers share one fetch. */
  let inflight: Promise<void> | null = null

  const current = computed(
    () => organizations.value.find((org) => org.id === currentOrgId.value) ?? organizations.value[0] ?? null,
  )

  function load(force = false): Promise<void> {
    if (loaded.value && !force) return Promise.resolve()
    if (inflight) return inflight
    loading.value = true
    inflight = (async () => {
      try {
        const res = await api<{ organizations: Organization[] }>('/orgs')
        organizations.value = res.organizations
        loaded.value = true
      } finally {
        loading.value = false
        inflight = null
      }
    })()
    return inflight
  }

  function setCurrent(id: string) {
    currentOrgId.value = id
  }

  async function create(name: string): Promise<Organization> {
    const res = await api<{ organization: Organization }>('/orgs', { method: 'POST', body: { name } })
    organizations.value = [...organizations.value, res.organization]
    currentOrgId.value = res.organization.id
    return res.organization
  }

  async function rename(id: string, name: string): Promise<void> {
    const res = await api<{ organization: Organization }>(`/orgs/${id}`, { method: 'PATCH', body: { name } })
    organizations.value = organizations.value.map((org) =>
      org.id === id ? { ...org, name: res.organization.name } : org,
    )
  }

  async function remove(id: string): Promise<void> {
    await api(`/orgs/${id}`, { method: 'DELETE' })
    organizations.value = organizations.value.filter((org) => org.id !== id)
    if (currentOrgId.value === id) currentOrgId.value = organizations.value[0]?.id ?? null
  }

  function reset() {
    organizations.value = []
    loaded.value = false
    loading.value = false
    currentOrgId.value = null
    inflight = null
  }

  return { organizations, loaded, loading, currentOrgId, current, load, setCurrent, create, rename, remove, reset }
})
