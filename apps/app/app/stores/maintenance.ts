/** Maintenance gate state. Any 503 from the API (plugins/api.ts) raises it;
 *  the overlay polls /health and reloads the app once the admin lifts it.
 *  Admins never see it — the API exempts them, so their calls never 503. */
export const useMaintenanceStore = defineStore('maintenance', () => {
  const active = ref(false)
  const message = ref<string | null>(null)

  function raise(detail?: string | null) {
    active.value = true
    if (detail) message.value = detail
  }

  /** One probe: still down → stay; lifted → reload for a clean slate. */
  async function checkNow(): Promise<void> {
    try {
      const res = await $fetch<{ maintenance?: { enabled: boolean } }>('/health', {
        baseURL: useRuntimeConfig().public.apiBase,
      })
      if (res.maintenance?.enabled === false) window.location.reload()
    } catch {
      /* API unreachable — keep waiting */
    }
  }

  function reset() {
    active.value = false
    message.value = null
  }

  return { active, message, raise, checkNow, reset }
})
