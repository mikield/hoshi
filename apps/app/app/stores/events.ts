import { opencodeUrl, streamEvents, type OpencodeEvent } from '~/composables/useOpencode'

type Handler = (event: OpencodeEvent) => void

/** ONE live /event connection for the whole app, fanned out to subscribers.
 *  Browsers cap HTTP/1.1 connections per origin at 6 — per-page streams
 *  exhaust the pool and silently queue every other request. */
export const useEventsStore = defineStore('events', () => {
  const handlers = new Set<Handler>()
  let abort: AbortController | null = null

  function start() {
    if (abort || import.meta.server) return
    abort = new AbortController()
    void streamEvents(opencodeUrl('/event'), fanOut, abort.signal)
  }

  /** One broken subscriber must never starve the others or kill the stream. */
  function fanOut(event: OpencodeEvent) {
    for (const handler of handlers) {
      try {
        handler(event)
      } catch (error) {
        console.error('[events] subscriber failed on', event.type, error)
      }
    }
  }

  /** Register a handler; returns the matching unsubscribe. The stream opens
   *  lazily with the first subscriber and stays up for the session. */
  function subscribe(handler: Handler): () => void {
    if (typeof handler !== 'function') {
      // A store action missing from its setup-return arrives here as undefined.
      console.error('[events] non-function subscriber registered:', handler)
      return () => {}
    }
    handlers.add(handler)
    start()
    return () => handlers.delete(handler)
  }

  function reset() {
    abort?.abort()
    abort = null
    handlers.clear()
  }

  return { subscribe, reset }
})
