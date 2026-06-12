import { playChime } from '~/composables/useChime'
import type { OpencodeEvent, SessionStatus } from '~/composables/useOpencode'

export interface AlertPrefs {
  /** Desktop notifications (requires browser permission). */
  notifications: boolean
  notifyComplete: boolean
  notifyInput: boolean
  notifyError: boolean
  /** Audio cues. */
  sounds: boolean
  soundComplete: boolean
  soundInput: boolean
  soundError: boolean
  /** 0–100. */
  volume: number
}

const STORAGE_KEY = 'hoshi-alerts'

const DEFAULTS: AlertPrefs = {
  notifications: false,
  notifyComplete: true,
  notifyInput: true,
  notifyError: true,
  sounds: false,
  soundComplete: true,
  soundInput: true,
  soundError: true,
  volume: 60,
}

/** Session-activity alerts: watches the shared event stream and raises a
 *  chime and/or desktop notification when a turn finishes or fails — unless
 *  the user is already looking at that session. Device-level prefs persist
 *  in localStorage. */
export const useAlertsStore = defineStore('alerts', () => {
  const prefs = ref<AlertPrefs>({ ...DEFAULTS })

  /** Sessions we saw go busy — only their idle transitions are completions. */
  const busySessions = new Set<string>()
  let unsubscribe: (() => void) | null = null

  /** Client-only, once per signed-in session — called from app.vue. */
  function init() {
    if (unsubscribe || import.meta.server) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) prefs.value = { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AlertPrefs>) }
    } catch {
      /* corrupted prefs — fall back to defaults */
    }
    watch(prefs, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })
    unsubscribe = useEventsStore().subscribe(onEvent)
  }

  function onEvent(event: OpencodeEvent) {
    const props = event.properties
    switch (event.type) {
      case 'session.status':
        if ((props.status as SessionStatus).type !== 'idle') busySessions.add(props.sessionID as string)
        break
      case 'session.idle': {
        const id = props.sessionID as string
        if (busySessions.delete(id)) onComplete(id)
        break
      }
      case 'session.error': {
        const id = props.sessionID as string | undefined
        if (id) busySessions.delete(id)
        onError(id)
        break
      }
      case 'question.asked':
        onQuestion(props.sessionID as string, (props.questions as Array<{ question: string }>)?.[0]?.question)
        break
    }
  }

  /** The user is watching this exact session right now — no alert needed. */
  function isWatching(sessionId: string): boolean {
    return document.visibilityState === 'visible' && useRoute().params.sessionId === sessionId
  }

  function sessionTitle(sessionId: string): string {
    return useSessionsStore().sessions.find((s) => s.id === sessionId)?.title || 'A session'
  }

  function onComplete(sessionId: string) {
    if (isWatching(sessionId)) return
    if (prefs.value.sounds && prefs.value.soundComplete) playChime('complete', prefs.value.volume / 100)
    if (prefs.value.notifications && prefs.value.notifyComplete && document.hidden) {
      showNotification('Session finished', `${sessionTitle(sessionId)} is done and waiting for you.`, sessionId)
    }
  }

  function onError(sessionId?: string) {
    if (sessionId && isWatching(sessionId)) return
    if (prefs.value.sounds && prefs.value.soundError) playChime('error', prefs.value.volume / 100)
    if (prefs.value.notifications && prefs.value.notifyError && document.hidden) {
      showNotification('Session failed', sessionId ? `${sessionTitle(sessionId)} hit an error.` : 'A session hit an error.', sessionId)
    }
  }

  function onQuestion(sessionId: string, question?: string) {
    if (isWatching(sessionId)) return
    if (prefs.value.sounds && prefs.value.soundInput) playChime('input', prefs.value.volume / 100)
    if (prefs.value.notifications && prefs.value.notifyInput && document.hidden) {
      showNotification('Needs your input', question ?? `${sessionTitle(sessionId)} is waiting for an answer.`, sessionId)
    }
  }

  function showNotification(title: string, body: string, sessionId?: string) {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const router = useRouter()
    const projectId = useRoute().params.id as string | undefined
    const notification = new Notification(title, { body, tag: sessionId ?? 'hoshi' })
    notification.onclick = () => {
      window.focus()
      if (sessionId && projectId) void router.push(`/projects/${projectId}/sessions/${sessionId}`)
      notification.close()
    }
  }

  /** Master toggle — flipping on walks the browser permission flow and only
   *  sticks when permission is actually granted. */
  async function setNotifications(enabled: boolean): Promise<void> {
    if (!enabled) {
      prefs.value.notifications = false
      return
    }
    if (typeof Notification === 'undefined') return
    const permission =
      Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission
    prefs.value.notifications = permission === 'granted'
  }

  function sendTestNotification() {
    showNotification('Hoshi notifications are on', 'This is what a session alert looks like.')
  }

  function reset() {
    unsubscribe?.()
    unsubscribe = null
    busySessions.clear()
    prefs.value = { ...DEFAULTS }
  }

  return { prefs, init, setNotifications, sendTestNotification, reset }
})
