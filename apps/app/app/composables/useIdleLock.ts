/** How long without input before the app locks itself. */
const IDLE_LOCK_MS = 15 * 60 * 1000
/** Activity is sampled, not handled per-event — cheap even on mousemove. */
const CHECK_EVERY_MS = 30 * 1000

const ACTIVITY_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const

/** Auto-lock after inactivity. Call once from app.vue — only locks while a
 *  user is signed in; the session itself stays alive behind the lock. */
export function useIdleLock(timeoutMs = IDLE_LOCK_MS): void {
  const auth = useAuthStore()

  onMounted(() => {
    auth.restoreLock()

    let lastActivity = Date.now()
    const noteActivity = () => {
      lastActivity = Date.now()
    }

    for (const name of ACTIVITY_EVENTS) {
      window.addEventListener(name, noteActivity, { passive: true })
    }

    const timer = setInterval(() => {
      if (auth.user && !auth.locked && Date.now() - lastActivity >= timeoutMs) {
        auth.lock()
      }
    }, CHECK_EVERY_MS)

    onUnmounted(() => {
      for (const name of ACTIVITY_EVENTS) {
        window.removeEventListener(name, noteActivity)
      }
      clearInterval(timer)
    })
  })
}
