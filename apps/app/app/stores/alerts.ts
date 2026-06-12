import { playChime, type ChimeKind } from '~/composables/useChime'
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

type AlertKind = 'complete' | 'input' | 'error'

/** Which pref pair gates each alert kind — the one place the mapping lives. */
const KIND_PREFS: Record<AlertKind, { sound: keyof AlertPrefs; notify: keyof AlertPrefs }> = {
  complete: { sound: 'soundComplete', notify: 'notifyComplete' },
  input: { sound: 'soundInput', notify: 'notifyInput' },
  error: { sound: 'soundError', notify: 'notifyError' },
}

/** Session-activity alerts: watches the shared event stream and raises a
 *  chime and/or desktop notification when a turn finishes, fails, or waits on
 *  input — unless the user is already looking at that session. Prefs are
 *  device-level: they persist in localStorage and survive logout. */
export const useAlertsStore = defineStore('alerts', () => {
  const prefs = ref<AlertPrefs>({ ...DEFAULTS })

  /** Sessions we saw go busy — only their idle transitions are completions. */
  const busySessions = new Set<string>()
  let unsubscribe: (() => void) | null = null

  // Persist on any change — registered once for the store's lifetime.
  watch(prefs, (value) => {
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }, { deep: true })

  /** Client-only, once per signed-in session — called from app.vue. */
  function init() {
    if (unsubscribe || import.meta.server) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) prefs.value = { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AlertPrefs>) }
    } catch {
      /* corrupted prefs — fall back to defaults */
    }
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
        if (busySessions.delete(id)) {
          raise('complete', id, 'Session finished', `${sessionTitle(id)} is done and waiting for you.`)
        }
        break
      }
      case 'session.error': {
        const id = props.sessionID as string | undefined
        if (id) busySessions.delete(id)
        raise('error', id, 'Session failed', id ? `${sessionTitle(id)} hit an error.` : 'A session hit an error.')
        break
      }
      case 'question.asked': {
        const id = props.sessionID as string
        const question = (props.questions as Array<{ question: string }>)?.[0]?.question
        raise('input', id, 'Needs your input', question ?? `${sessionTitle(id)} is waiting for an answer.`)
        break
      }
    }
  }

  /** One pipeline for every alert kind: skip when the user is watching that
   *  session, chime when sounds allow it, notify when the tab is hidden. */
  function raise(kind: AlertKind, sessionId: string | undefined, title: string, body: string) {
    if (sessionId && isWatching(sessionId)) return
    const gate = KIND_PREFS[kind]
    if (prefs.value.sounds && prefs.value[gate.sound]) playChime(kind as ChimeKind, prefs.value.volume / 100)
    if (prefs.value.notifications && prefs.value[gate.notify] && document.hidden) {
      showNotification(title, body, sessionId)
    }
  }

  /** The user is watching this exact session right now — no alert needed. */
  function isWatching(sessionId: string): boolean {
    return document.visibilityState === 'visible' && useRoute().params.sessionId === sessionId
  }

  function sessionTitle(sessionId: string): string {
    return useSessionsStore().sessions.find((s) => s.id === sessionId)?.title || 'A session'
  }

  function showNotification(title: string, body: string, sessionId?: string) {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const notification = new Notification(title, { body, tag: sessionId ?? 'hoshi' })
    // Only link when we can name the session's project — guessing from the
    // current route would build dead URLs for other projects' sessions.
    const owner = useSessionsStore()
    const target =
      sessionId && owner.sessions.some((s) => s.id === sessionId) && owner.projectId
        ? `/projects/${owner.projectId}/sessions/${sessionId}`
        : null
    const router = useRouter()
    notification.onclick = () => {
      window.focus()
      if (target) void router.push(target)
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

  /** Stop listening on logout. Prefs intentionally stay — they belong to the
   *  device, not the account. */
  function reset() {
    unsubscribe?.()
    unsubscribe = null
    busySessions.clear()
  }

  return { prefs, init, setNotifications, sendTestNotification, reset }
})
