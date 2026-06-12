import type { Ref } from 'vue'
import { unwrap, type OpencodeClient, type OpencodeEvent, type SessionInfo } from '~/composables/useOpencode'

/** Sub-session links of the open session: children spawned from it (task
 *  tool, forks) and its parent when it is itself a sub-session. Kept live by
 *  feeding the page's event stream into `applyEvent`. */
export function useSessionRelations(client: () => OpencodeClient | null, sessionId: Ref<string>) {
  const children = ref<SessionInfo[]>([])
  const parent = ref<SessionInfo | null>(null)

  async function load(id: string) {
    children.value = []
    parent.value = null
    const oc = client()
    if (!oc) return
    try {
      children.value = unwrap<SessionInfo[]>(await oc.session.children({ path: { id } }))
      const self = unwrap<SessionInfo>(await oc.session.get({ path: { id } }))
      if (self?.parentID) {
        parent.value = unwrap<SessionInfo>(await oc.session.get({ path: { id: self.parentID } }))
      }
    } catch {
      /* relations are decorative — the thread still works without them */
    }
  }

  function applyEvent(event: OpencodeEvent) {
    const info = event.properties.info as SessionInfo | undefined
    if (!info) return
    if (event.type === 'session.created' && info.parentID === sessionId.value) {
      children.value = [...children.value, info]
    } else if (event.type === 'session.updated') {
      children.value = children.value.map((s) => (s.id === info.id ? info : s))
    }
  }

  return { children, parent, load, applyEvent }
}
