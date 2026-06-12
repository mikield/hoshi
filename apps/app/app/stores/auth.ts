export interface AuthUser {
  id: number
  email: string
  name: string | null
  isAdmin?: boolean
}

/** Signed-in user. `logout()` resets every store so the next account starts clean. */
const LOCK_KEY = 'hoshi-locked'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  /** Inactivity lock — the session stays alive, the UI is blocked until re-auth. */
  const locked = ref(false)
  const api = useApi()

  async function fetchUser(): Promise<AuthUser | null> {
    const res = await api<{ user: AuthUser | null }>('/auth/me')
    user.value = res.user
    return user.value
  }

  async function updateName(name: string): Promise<void> {
    const res = await api<{ user: AuthUser }>('/auth/me', { method: 'PATCH', body: { name } })
    user.value = res.user
  }

  function lock(): void {
    locked.value = true
    if (import.meta.client) localStorage.setItem(LOCK_KEY, '1')
  }

  /** Re-confirm the password against the live session — throws on mismatch. */
  async function unlock(password: string): Promise<void> {
    await api('/auth/unlock', { method: 'POST', body: { password } })
    locked.value = false
    if (import.meta.client) localStorage.removeItem(LOCK_KEY)
  }

  /** A lock set before a reload survives it — called once on client mount. */
  function restoreLock(): void {
    if (import.meta.client && localStorage.getItem(LOCK_KEY) === '1') locked.value = true
  }

  async function logout(): Promise<void> {
    await api('/auth/logout', { method: 'POST' })
    reset()
    useOrganizationsStore().reset()
    useProjectsStore().reset()
    useChatStore().reset()
    useMachineStore().reset()
    useSessionsStore().reset()
    useCatalogStore().reset()
    useEventsStore().reset()
    useAlertsStore().reset()
    await navigateTo('/login')
  }

  function reset() {
    user.value = null
    locked.value = false
    if (import.meta.client) localStorage.removeItem(LOCK_KEY)
  }

  return { user, locked, fetchUser, updateName, lock, unlock, restoreLock, logout, reset }
})
