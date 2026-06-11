/** Route guard for signed-in areas — hydrates the auth store, redirects to /login otherwise.
 *  The store survives navigations, so the API is only hit once per visit. */
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.user) {
    try {
      await auth.fetchUser()
    } catch {
      /* unreachable API reads as signed out */
    }
  }
  if (!auth.user) return navigateTo('/login')
})
