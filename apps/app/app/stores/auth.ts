export interface AuthUser {
  id: number
  email: string
  name: string | null
  isAdmin?: boolean
}

/** Signed-in user. `logout()` resets every store so the next account starts clean. */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
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

  async function logout(): Promise<void> {
    await api('/auth/logout', { method: 'POST' })
    reset()
    useOrganizationsStore().reset()
    useProjectsStore().reset()
    useChatStore().reset()
    await navigateTo('/login')
  }

  function reset() {
    user.value = null
  }

  return { user, fetchUser, updateName, logout, reset }
})
