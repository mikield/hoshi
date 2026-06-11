/** Fetch against the Hoshi API server (apps/api) — see plugins/api.ts. */
export function useApi() {
  return useNuxtApp().$api
}

/** Absolute URL on the API server, for non-$fetch consumers (OpenCode SDK). */
export function apiUrl(path = ''): string {
  return `${useRuntimeConfig().public.apiBase}${path}`
}
