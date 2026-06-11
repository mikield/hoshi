import { toast } from 'vue-sonner'
import {
  createOpencodeClient,
  unwrap,
  OPENCODE_CONNECT_ERROR,
  type OpencodeClient,
  type SessionInfo,
} from '~/composables/useOpencode'
import {
  fetchProjectSessionIds,
  registerProjectSession,
  unregisterProjectSession,
} from '~/composables/useProjects'

/** The current project's session list — owned by the project layout so the
 *  sidebar survives page navigation, shared with the pages that mutate it
 *  (create, fork, SSE updates). */
export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref<SessionInfo[]>([])
  const loading = ref(true)
  const creating = ref(false)
  const connectError = ref<string | null>(null)
  const projectId = ref<string | null>(null)

  let client: OpencodeClient | null = null

  async function getClient(): Promise<OpencodeClient> {
    if (!client) client = await createOpencodeClient()
    return client
  }

  /** Load the list for a project. Already-loaded same-project calls are
   *  no-ops so home ↔ session navigation never reflashes the sidebar. */
  async function load(project: string, force = false): Promise<void> {
    if (projectId.value === project && !force && !loading.value) return
    if (projectId.value !== project) {
      sessions.value = []
      projectId.value = project
    }
    loading.value = true
    try {
      const oc = await getClient()
      const [list, ids] = await Promise.all([oc.session.list(), fetchProjectSessionIds(project)])
      // A slower response for a project we already left must not clobber the list.
      if (projectId.value !== project) return
      sessions.value = unwrap<SessionInfo[]>(list).filter((s) => ids.has(s.id))
      connectError.value = null
    } catch {
      connectError.value = OPENCODE_CONNECT_ERROR
    } finally {
      if (projectId.value === project) loading.value = false
    }
  }

  /** Shell "New session": create an empty session and jump into it. */
  async function createBlank(project: string): Promise<void> {
    if (creating.value) return
    creating.value = true
    try {
      const oc = await getClient()
      const created = unwrap<SessionInfo>(await oc.session.create({ body: { title: 'New session' } }))
      await registerProjectSession(project, created.id)
      add(created)
      await navigateTo(`/projects/${project}/sessions/${created.id}`)
    } catch {
      connectError.value = OPENCODE_CONNECT_ERROR
    } finally {
      creating.value = false
    }
  }

  /** Delete + unlink; leaves the page if the deleted session was open. */
  async function remove(project: string, id: string): Promise<void> {
    try {
      const oc = await getClient()
      await oc.session.delete({ path: { id } })
    } catch {
      connectError.value = OPENCODE_CONNECT_ERROR
      return
    }
    try {
      await unregisterProjectSession(project, id)
    } catch {
      toast.error('Failed to unlink the session from this project')
    }
    sessions.value = sessions.value.filter((s) => s.id !== id)
    if (useRoute().params.sessionId === id) {
      await navigateTo(`/projects/${project}`)
    }
  }

  /** Prepend a session this client just created (composer send, fork, …). */
  function add(session: SessionInfo): void {
    sessions.value = [session, ...sessions.value.filter((s) => s.id !== session.id)]
  }

  function reset(): void {
    sessions.value = []
    loading.value = true
    creating.value = false
    connectError.value = null
    projectId.value = null
    client = null
  }

  return { sessions, loading, creating, connectError, load, createBlank, remove, add, reset }
})
