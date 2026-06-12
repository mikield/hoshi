/** $fetch instance bound to the Hoshi API server. Credentialed so the session
 *  cookie flows cross-origin; during SSR the browser's cookie is forwarded so
 *  auth survives server-side rendering. */
export default defineNuxtPlugin((nuxtApp) => {
  const { apiBase } = useRuntimeConfig().public

  const api = $fetch.create({
    baseURL: apiBase,
    credentials: 'include',
    headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
    onResponseError({ response }) {
      // Maintenance gate: any 503 raises the global overlay (admins are
      // exempt server-side, so their calls never land here).
      if (response.status === 503) {
        nuxtApp.runWithContext(() =>
          useMaintenanceStore().raise(response._data?.statusMessage ?? response._data?.message ?? null),
        )
      }
    },
  })

  return { provide: { api } }
})

declare module '#app' {
  interface NuxtApp {
    $api: typeof $fetch
  }
}
