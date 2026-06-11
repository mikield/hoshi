/** $fetch instance bound to the Hoshi API server. Credentialed so the session
 *  cookie flows cross-origin; during SSR the browser's cookie is forwarded so
 *  auth survives server-side rendering. */
export default defineNuxtPlugin(() => {
  const { apiBase } = useRuntimeConfig().public

  const api = $fetch.create({
    baseURL: apiBase,
    credentials: 'include',
    headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
    onResponseError({ response }) {
      // Maintenance gate: any 503 flips the whole app to the maintenance screen.
      if (response.status === 503) {
        showError({ statusCode: 503, statusMessage: response._data?.statusMessage ?? response._data?.message })
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
