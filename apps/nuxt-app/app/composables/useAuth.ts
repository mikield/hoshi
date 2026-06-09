export interface AuthUser {
  id: number
  email: string
  name: string | null
}

/** Shared signed-in user state, hydrated by the `auth` middleware / `/api/auth/me`. */
export function useAuthUser() {
  return useState<AuthUser | null>('auth:user', () => null)
}

export async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  useAuthUser().value = null
  await navigateTo('/login')
}
