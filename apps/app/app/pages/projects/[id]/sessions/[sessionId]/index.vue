<script setup lang="ts">
import {ref, computed, watch, nextTick, onBeforeUnmount} from 'vue'
import {Logo, cn, AnimatedThinkingText, Skeleton} from '@hoshi/ui'
import {AlertCircle as AlertCircleIcon} from 'lucide-vue-next'
import {toast} from 'vue-sonner'
import type {PanelView} from '~/components/WorkspaceSidePanel.vue'
import {
  createOpencodeClient,
  unwrap,
  partsText,
  turnItems,
  fetchModels,
  fetchAgents,
  fetchCommands,
  contextUsage,
  filePartsFrom,
  streamEvents,
  OPENCODE_MODEL,
  OPENCODE_CONNECT_ERROR,
  type OpencodeClient,
  type OpencodeEvent,
  type SessionInfo,
  type SessionStatus,
  type ChatMessage,
  type Part,
  type ModelOption,
  type AgentOption,
  type CommandOption,
  type OutgoingFile,
} from '~/composables/useOpencode'
import {
  fetchProjectSessionIds,
  registerProjectSession,
  unregisterProjectSession,
} from '~/composables/useProjects'

definePageMeta({middleware: 'auth'})

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const sessionId = computed(() => route.params.sessionId as string)

let client: OpencodeClient | null = null
const connectError = ref<string | null>(null)
const sessions = ref<SessionInfo[]>([])
const loadingSessions = ref(true)
const creating = ref(false)
const messages = ref<ChatMessage[]>([])
const loadingMessages = ref(true)
const input = ref('')
const sending = ref(false)
/** Server-reported session activity (session.status / session.idle events). */
const sessionBusy = ref(false)
const busy = computed(() => sending.value || sessionBusy.value)
const eventsAbort = new AbortController()
const scrollRef = ref<HTMLDivElement | null>(null)

const panelOpen = ref(false)
const panelView = ref<PanelView>('actions')
const splitPct = ref(50)
const dragRef = ref<HTMLDivElement | null>(null)
const dragging = ref(false)

const models = ref<ModelOption[]>([])
const agents = ref<AgentOption[]>([])
const commands = ref<CommandOption[]>([])
// Persisted across sessions so the chosen model/agent sticks.
const { selectedModel, selectedAgent } = storeToRefs(useChatStore())

const context = computed(() => contextUsage(messages.value, models.value))

const promptModel = computed(() => {
  const [providerID, ...rest] = (selectedModel.value ?? '').split('/')
  return providerID && rest.length ? { providerID, modelID: rest.join('/') } : OPENCODE_MODEL
})

/** Group the flat message list into turns: one user message + the assistant
 *  messages that follow it (mirrors suna's turn-based renderer). */
const turns = computed(() => {
  const out: { user: ChatMessage | null; assistant: ChatMessage[] }[] = []
  for (const m of messages.value) {
    if (m.info.role === 'user') {
      out.push({user: m, assistant: []})
    } else {
      if (out.length === 0) out.push({user: null, assistant: []})
      out[out.length - 1]!.assistant.push(m)
    }
  }
  return out.filter(
    (t) => (t.user && partsText(t.user.parts)) || turnItems(t.assistant).length > 0,
  )
})

onMounted(async () => {
  client = await createOpencodeClient()
  streamEvents(client, onEvent, eventsAbort.signal)
  await refreshSessions()
  await loadMessages(sessionId.value)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('keydown', onGlobalKey)
  // Selector data is secondary — load it after the thread, tolerate failure.
  try {
    ;[models.value, agents.value, commands.value] = await Promise.all([
      fetchModels(client),
      fetchAgents(client),
      fetchCommands(client),
    ])
    if (!selectedModel.value && models.value.length > 0) {
      // Prefer the configured default, but only if this server actually has it.
      const fallback = `${OPENCODE_MODEL.providerID}/${OPENCODE_MODEL.modelID}`
      const exists = models.value.some((m) => `${m.providerID}/${m.modelID}` === fallback)
      const first = models.value[0]!
      selectedModel.value = exists ? fallback : `${first.providerID}/${first.modelID}`
    }
    // Pin the default agent so the pill always shows what prompts actually use.
    if (!selectedAgent.value && agents.value.length > 0) {
      selectedAgent.value = agents.value[0]!.name
    }
  } catch {
    /* composer degrades to plain input */
  }
})

onBeforeUnmount(() => {
  eventsAbort.abort()
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
  window.removeEventListener('keydown', onGlobalKey)
})

watch(sessionId, (id) => {
  if (id) {
    sessionBusy.value = false
    loadMessages(id)
  }
})

watch(
  messages,
  () => {
    nextTick(() => {
      scrollRef.value?.scrollTo({top: scrollRef.value.scrollHeight, behavior: 'smooth'})
    })
  },
  {deep: true},
)

// ── Live event stream ────────────────────────────────────────────────────────

function onEvent(event: OpencodeEvent) {
  const props = event.properties
  switch (event.type) {
    case 'message.updated':
      upsertMessageInfo(props.info as ChatMessage['info'])
      break
    case 'message.removed':
      if (props.sessionID === sessionId.value) {
        messages.value = messages.value.filter((m) => m.info.id !== props.messageID)
      }
      break
    case 'message.part.updated':
      upsertPart(props.part as Part)
      break
    case 'message.part.removed':
      if (props.sessionID === sessionId.value) {
        const message = messages.value.find((m) => m.info.id === props.messageID)
        if (message) message.parts = message.parts.filter((p) => p.id !== props.partID)
      }
      break
    case 'session.status':
      if (props.sessionID === sessionId.value) {
        sessionBusy.value = (props.status as SessionStatus).type !== 'idle'
      }
      break
    case 'session.idle':
      if (props.sessionID === sessionId.value) sessionBusy.value = false
      break
    case 'session.updated':
      sessions.value = sessions.value.map((s) => (s.id === props.info.id ? (props.info as SessionInfo) : s))
      break
    case 'session.deleted':
      sessions.value = sessions.value.filter((s) => s.id !== props.info.id)
      if (props.info.id === sessionId.value) navigateTo(`/projects/${projectId.value}`)
      break
    case 'session.error':
      if (!props.sessionID || props.sessionID === sessionId.value) {
        const error = props.error as { name?: string; data?: { message?: string } } | undefined
        toast.error(error?.data?.message ?? error?.name ?? 'The session hit an error.')
        sessionBusy.value = false
      }
      break
  }
}

/** Apply a message.updated event: refresh info in place, or append a new
 *  message (replacing the optimistic local user message it confirms). */
function upsertMessageInfo(info: ChatMessage['info']) {
  if (info.sessionID !== sessionId.value) return
  const existing = messages.value.find((m) => m.info.id === info.id)
  if (existing) {
    existing.info = info
    return
  }
  const next = info.role === 'user'
    ? messages.value.filter((m) => !m.info.id.startsWith('local-'))
    : [...messages.value]
  next.push({info, parts: []})
  messages.value = next
}

/** Apply a message.part.updated event: replace the part by id, or append —
 *  events arrive in creation order, so append preserves part order. */
function upsertPart(part: Part) {
  if (part.sessionID !== sessionId.value || !part.messageID) return
  const message = messages.value.find((m) => m.info.id === part.messageID)
  if (!message) return
  const index = message.parts.findIndex((p) => p.id === part.id)
  if (index === -1) message.parts.push(part)
  else message.parts[index] = part
}

function onGlobalKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && (e.key === 'i' || e.key === 'I')) {
    e.preventDefault()
    panelOpen.value = !panelOpen.value
  }
}

async function refreshSessions() {
  loadingSessions.value = true
  try {
    const [list, projectIds] = await Promise.all([
      client!.session.list(),
      fetchProjectSessionIds(projectId.value),
    ])
    sessions.value = unwrap<SessionInfo[]>(list).filter((s) => projectIds.has(s.id))
    connectError.value = null
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
  } finally {
    loadingSessions.value = false
  }
}

async function loadMessages(id: string) {
  loadingMessages.value = messages.value.length === 0
  try {
    const res = await client!.session.messages({path: {id}})
    const list = unwrap<ChatMessage[]>(res)
    if (!Array.isArray(list)) throw new Error('Session not found')
    messages.value = list
  } catch {
    messages.value = []
    // A dead or foreign session link lands on the project home, like Suna.
    if (!sessions.value.some((s) => s.id === id)) await navigateTo(`/projects/${projectId.value}`)
  } finally {
    loadingMessages.value = false
  }
}

async function createSession() {
  if (creating.value) return
  creating.value = true
  let created: SessionInfo | null = null
  try {
    created = unwrap<SessionInfo>(await client!.session.create({body: {title: 'New session'}}))
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
    creating.value = false
    return
  }
  try {
    await registerProjectSession(projectId.value, created.id)
    sessions.value = [created, ...sessions.value]
    await navigateTo(`/projects/${projectId.value}/sessions/${created.id}`)
  } catch {
    toast.error('Failed to link the session to this project')
  } finally {
    creating.value = false
  }
}

async function deleteSession(id: string) {
  try {
    await client!.session.delete({path: {id}})
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
    return
  }
  try {
    await unregisterProjectSession(projectId.value, id)
  } catch {
    toast.error('Failed to unlink the session from this project')
  }
  sessions.value = sessions.value.filter((s) => s.id !== id)
  if (id === sessionId.value) {
    await navigateTo(`/projects/${projectId.value}`)
  }
}

/** Shared dispatch: optimistic user message, then the prompt call. The reply
 *  streams in through onEvent; the final reload reconciles any missed events
 *  (the call resolves when the turn completes). */
async function dispatch(optimisticParts: ChatMessage['parts'], call: () => Promise<unknown>) {
  if (busy.value) return
  input.value = ''
  sending.value = true
  messages.value = [...messages.value, {info: {id: `local-${Date.now()}`, role: 'user'}, parts: optimisticParts}]
  try {
    await call()
    await loadMessages(sessionId.value)
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
  } finally {
    sending.value = false
  }
}

async function send(text: string, files: OutgoingFile[]) {
  const parts = [...filePartsFrom(files), ...(text ? [{type: 'text', text}] : [])]
  await dispatch(parts, () =>
    client!.session.prompt({
      path: {id: sessionId.value},
      body: {
        model: promptModel.value,
        ...(selectedAgent.value ? {agent: selectedAgent.value} : {}),
        parts,
      },
    }),
  )
}

async function runCommand(name: string, args: string) {
  await dispatch([{type: 'text', text: `/${name}${args ? ` ${args}` : ''}`}], () =>
    client!.session.command({
      path: {id: sessionId.value},
      body: {
        command: name,
        arguments: args,
        model: `${promptModel.value.providerID}/${promptModel.value.modelID}`,
        ...(selectedAgent.value ? {agent: selectedAgent.value} : {}),
      },
    }),
  )
}

function onMove(e: MouseEvent) {
  if (!dragging.value || !dragRef.value) return
  const rect = dragRef.value.getBoundingClientRect()
  const pct = ((e.clientX - rect.left) / rect.width) * 100
  splitPct.value = Math.min(65, Math.max(30, pct))
}

function onUp() {
  dragging.value = false
  document.body.style.cursor = ''
}

function startDrag() {
  dragging.value = true
  document.body.style.cursor = 'col-resize'
}

function selectSession(id: string) {
  navigateTo(`/projects/${projectId.value}/sessions/${id}`)
}
</script>

<template>
  <ProjectShell
      :project-id="projectId"
      :sessions="sessions"
      :active-session-id="sessionId"
      :loading="loadingSessions"
      :creating="creating"
      @select="selectSession"
      @create="createSession"
      @delete="deleteSession"
  >
    <div class="flex h-full flex-col overflow-hidden bg-background">
      <div v-if="connectError"
           class="flex items-center gap-2 border-b border-border/60 bg-destructive/6 px-5 py-2.5 text-sm text-destructive">
        <AlertCircleIcon class="size-4 shrink-0"/>
        {{ connectError }}
      </div>

      <div ref="dragRef" class="flex min-h-0 flex-1 overflow-hidden bg-background">
        <!-- Main content panel (chat) -->
        <div
            :class="cn('relative flex flex-col overflow-hidden bg-transparent', panelOpen && 'pl-3 pr-1.5')"
            :style="{ width: panelOpen ? `${splitPct}%` : '100%' }"
        >
          <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div class="relative flex h-full flex-col bg-background">
              <SessionSiteHeader
                  :is-side-panel-open="panelOpen"
                  @toggle-side-panel="panelOpen = !panelOpen"
                  @new-session="createSession"
                  @delete="deleteSession(sessionId)"
              />

              <!-- Messages -->
              <div class="relative z-10 min-h-0 flex-1">
                <div
                    ref="scrollRef"
                    class="relative h-full flex-1 overflow-y-auto bg-background px-4 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
                >
                  <div role="log" :class="cn('mx-auto w-full min-w-0 px-3 transition-[max-width] duration-300 ease-out sm:px-6', panelOpen ? 'max-w-4xl' : 'max-w-5xl')">
                    <!-- Initial-load skeleton: a user bubble and a reply, matching thread shapes. -->
                    <div v-if="loadingMessages && turns.length === 0" class="flex min-w-0 flex-col gap-10 pt-8">
                      <Skeleton class="ml-auto h-10 w-2/5 rounded-2xl" />
                      <div class="space-y-2.5">
                        <Skeleton class="h-4 w-11/12" />
                        <Skeleton class="h-4 w-4/5" />
                        <Skeleton class="h-4 w-3/5" />
                      </div>
                    </div>
                    <div v-else class="flex min-w-0 flex-col pt-8">
                      <SessionTurn
                          v-for="(turn, i) in turns"
                          :key="turn.user?.info.id ?? i"
                          :class="i !== 0 && 'mt-12'"
                          :user="turn.user"
                          :assistant="turn.assistant"
                          :agents="agents"
                          :busy="busy && i === turns.length - 1"
                      />

                      <!-- Working indicator -->
                      <div v-if="busy" :class="cn('space-y-2', turns.length > 0 && 'mt-12')">
                        <div class="flex items-center gap-2 py-1 text-xs text-muted-foreground transition-colors relative">
                          <Logo variant="symbol" class="h-4 w-auto shrink-0 absolute -left-7 top-1"/>
                          <AnimatedThinkingText />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Composer -->
              <SessionChatInput
                  v-model="input"
                  v-model:model="selectedModel"
                  v-model:agent="selectedAgent"
                  :busy="busy"
                  :wide="!panelOpen"
                  :agents="agents"
                  :models="models"
                  :commands="commands"
                  :context="context"
                  autofocus
                  @send="send"
                  @command="runCommand"
              />
            </div>
          </div>
        </div>

        <!-- Resize handle -->
        <div v-if="panelOpen" class="relative z-20 w-0">
          <div
              role="separator"
              aria-orientation="vertical"
              class="absolute inset-y-0 -left-1.5 -right-1.5 cursor-col-resize bg-transparent hover:bg-border/20"
              @mousedown="startDrag"
          />
        </div>

        <!-- Side panel — Actions / Browser / Files / Terminal -->
        <div v-if="panelOpen" class="relative min-w-0 flex-1 overflow-hidden bg-background">
          <div class="h-full bg-background pb-6 pl-1.5 pr-3 pt-3 sm:pr-4">
            <div class="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-md border border-border bg-card"
                 style="min-height: 0">
              <WorkspaceSidePanel :view="panelView" :messages="messages" @change-view="panelView = $event" @close="panelOpen = false"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProjectShell>
</template>
