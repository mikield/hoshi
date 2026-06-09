import type { AuthUser } from '~/composables/useAuth'

/** Route guard for signed-in areas — hydrates the shared user state, redirects to /login otherwise. */
export default defineNuxtRouteMiddleware(async () => {
  const user = useAuthUser()
  const { data } = await useFetch<{ user: AuthUser | null }>('/api/auth/me', { key: 'auth-me' })
  user.value = data.value?.user ?? null
  if (!user.value) return navigateTo('/login')
})
