<script setup lang="ts">
import {ref, computed, watch, nextTick, onBeforeUnmount} from 'vue'
import {Logo, cn, AnimatedThinkingText, ChatMinimap, Skeleton} from '@hoshi/ui'
import {AlertCircle as AlertCircleIcon, CornerLeftUp, GitBranch, TextQuote} from 'lucide-vue-next'
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
  fetchSessionStatuses,
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
import {registerProjectSession} from '~/composables/useProjects'

// The project layout owns the shell + session list; the stable key keeps this
// page mounted across session switches — the sessionId watcher swaps the
// thread in place instead of remounting.
definePageMeta({middleware: 'auth', layout: 'project', key: 'project-session'})

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const sessionId = computed(() => route.params.sessionId as string)

let client: OpencodeClient | null = null
const connectError = ref<string | null>(null)
const sessionsStore = useSessionsStore()
const { sessions } = storeToRefs(sessionsStore)
const messages = ref<ChatMessage[]>([])
const loadingMessages = ref(true)
const input = ref('')
const quote = ref<string | null>(null)
const sending = ref(false)
/** Server-reported session activity (session.status / session.idle events). */
const sessionBusy = ref(false)
/** Human-readable detail of the retry/backoff state, when the server reports one. */
const statusDetail = ref<string | null>(null)
const busy = computed(() => sending.value || sessionBusy.value)
const eventsAbort = new AbortController()
const scrollRef = ref<HTMLDivElement | null>(null)

/** Sub-sessions spawned from this one (task tool, forks with parentID). */
const children = ref<SessionInfo[]>([])
/** Parent session, when this one is itself a sub-session. */
const parent = ref<SessionInfo | null>(null)

/** What the agent is doing right now — the last still-running tool call. The
 *  generic thinking animation is the fallback when nothing concrete is known. */
const activity = computed(() => {
  if (statusDetail.value) return statusDetail.value
  for (let m = messages.value.length - 1; m >= 0; m--) {
    const message = messages.value[m]!
    if (message.info.role !== 'assistant') continue
    for (let p = message.parts.length - 1; p >= 0; p--) {
      const part = message.parts[p]!
      if (part.type !== 'tool') continue
      const status = part.state?.status
      if (status === 'running' || status === 'pending') {
        const detail = part.state?.title
        return detail ? `${part.tool} · ${detail}` : part.tool ?? null
      }
    }
    break
  }
  return null
})

const panelOpen = ref(false)
const panelView = ref<PanelView>('actions')
const splitPct = ref(50)
const dragRef = ref<HTMLDivElement | null>(null)
const dragging = ref(false)

const models = ref<ModelOption[]>([])
const agents = ref<AgentOption[]>([])
const commands = ref<CommandOption[]>([])
const loadingSelectors = ref(true)
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

/** One minimap entry per user message — the history anchors on the right rail. */
const minimapItems = computed(() =>
  turns.value
    .filter((turn) => turn.user && partsText(turn.user.parts).trim())
    .map((turn) => ({ id: turn.user!.info.id, text: partsText(turn.user!.parts).trim() })),
)

onMounted(async () => {
  client = await createOpencodeClient()
  streamEvents(client, onEvent, eventsAbort.signal)
  // The layout loads the list too — this await only orders the dead-session
  // check in loadMessages after the list is known (no-op when already loaded).
  await sessionsStore.load(projectId.value)
  await loadMessages(sessionId.value)
  void replayStatus(sessionId.value)
  void loadRelations(sessionId.value)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('keydown', onGlobalKey)
  document.addEventListener('selectionchange', onSelectionChange)
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
  } finally {
    loadingSelectors.value = false
  }
})

onBeforeUnmount(() => {
  eventsAbort.abort()
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
  window.removeEventListener('keydown', onGlobalKey)
  document.removeEventListener('selectionchange', onSelectionChange)
})

watch([projectId, sessionId], ([, id]) => {
  if (!id) return
  sessionBusy.value = false
  statusDetail.value = null
  quote.value = null
  loadMessages(id)
  void replayStatus(id)
  void loadRelations(id)
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
        const status = props.status as SessionStatus
        sessionBusy.value = status.type !== 'idle'
        statusDetail.value = status.type === 'retry' ? status.message : null
      }
      break
    case 'session.idle':
      if (props.sessionID === sessionId.value) {
        sessionBusy.value = false
        statusDetail.value = null
        // Reconcile once the turn settles — catches anything events missed.
        void loadMessages(sessionId.value)
      }
      break
    case 'session.created':
      if ((props.info as SessionInfo).parentID === sessionId.value) {
        children.value = [...children.value, props.info as SessionInfo]
      }
      break
    case 'session.updated':
      sessions.value = sessions.value.map((s) => (s.id === props.info.id ? (props.info as SessionInfo) : s))
      children.value = children.value.map((s) => (s.id === props.info.id ? (props.info as SessionInfo) : s))
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

async function loadMessages(id: string) {
  loadingMessages.value = messages.value.length === 0
  try {
    const [res, info] = await Promise.all([
      client!.session.messages({path: {id}}),
      client!.session.get({path: {id}}),
    ])
    let list = unwrap<ChatMessage[]>(res)
    if (!Array.isArray(list)) throw new Error('Session not found')
    // A revert marker hides everything from that message on (until unrevert).
    const revertID = unwrap<SessionInfo & {revert?: {messageID: string}}>(info)?.revert?.messageID
    if (revertID) {
      const cut = list.findIndex((m) => m.info.id === revertID)
      if (cut !== -1) list = list.slice(0, cut)
    }
    messages.value = list
    syncSelectorsToSession(list)
  } catch {
    messages.value = []
    // A dead or foreign session link lands on the project home, like Suna.
    if (!sessions.value.some((s) => s.id === id)) await navigateTo(`/projects/${projectId.value}`)
  } finally {
    loadingMessages.value = false
  }
}

/** A session is bound to one agent/model — reflect what it actually ran with. */
function syncSelectorsToSession(list: ChatMessage[]) {
  const latest = [...list].reverse().find((m) => m.info.role === 'assistant')
  if (!latest) return
  if (latest.info.providerID && latest.info.modelID) {
    selectedModel.value = `${latest.info.providerID}/${latest.info.modelID}`
  }
  if (latest.info.agent) selectedAgent.value = latest.info.agent
}

/** Replay the session's live state on open: if the agent is still mid-turn
 *  (thinking, running tools), the UI shows it immediately — the message
 *  history holds the in-flight parts and the status map holds busy/retry. */
async function replayStatus(id: string) {
  try {
    const statuses = await fetchSessionStatuses(client!)
    const status = statuses[id]
    sessionBusy.value = !!status && status.type !== 'idle'
    statusDetail.value = status?.type === 'retry' ? status.message : null
  } catch {
    /* status is best-effort — events keep it current from here */
  }
}

/** Sub-session links: children spawned from here, and our parent if any. */
async function loadRelations(id: string) {
  children.value = []
  parent.value = null
  try {
    children.value = unwrap<SessionInfo[]>(await client!.session.children({path: {id}}))
    const self = unwrap<SessionInfo>(await client!.session.get({path: {id}}))
    if (self?.parentID) {
      parent.value = unwrap<SessionInfo>(await client!.session.get({path: {id: self.parentID}}))
    }
  } catch {
    /* relations are decorative — the thread still works without them */
  }
}

/** Roll the session back to the state before a user message — undoable. */
async function rewindTo(messageID: string) {
  try {
    await client!.session.revert({path: {id: sessionId.value}, body: {messageID}})
    await loadMessages(sessionId.value)
    toast('Session rewound', {
      action: {
        label: 'Undo',
        onClick: async () => {
          try {
            await client!.session.unrevert({path: {id: sessionId.value}})
            await loadMessages(sessionId.value)
          } catch {
            toast.error('Failed to undo the rewind')
          }
        },
      },
    })
  } catch {
    toast.error('Failed to rewind the session')
  }
}

/** Branch a new session that keeps history through this turn. The server
 *  copies everything *before* the anchor, so anchor at the next user message —
 *  or copy everything when forking from the latest turn. */
async function forkFrom(messageID: string) {
  const index = messages.value.findIndex((m) => m.info.id === messageID)
  const nextUser = index === -1
    ? undefined
    : messages.value.slice(index + 1).find((m) => m.info.role === 'user')
  try {
    const forked = unwrap<SessionInfo>(
      await client!.session.fork({
        path: {id: sessionId.value},
        body: nextUser ? {messageID: nextUser.info.id} : {},
      }),
    )
    await registerProjectSession(projectId.value, forked.id)
    sessionsStore.add(forked)
    toast.success('Forked into a new session')
    await navigateTo(`/projects/${projectId.value}/sessions/${forked.id}`)
  } catch {
    toast.error('Failed to fork the session')
  }
}

// ── Quote selection — float a button over selected thread text ──────────────

const selectionQuote = ref<{ x: number; y: number; text: string } | null>(null)

function onSelectionChange() {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed) selectionQuote.value = null
}

function onThreadMouseUp() {
  // Let the browser finalize the selection before reading it.
  requestAnimationFrame(() => {
    const selection = window.getSelection()
    const text = selection?.toString().trim() ?? ''
    if (!selection || selection.rangeCount === 0 || text.length < 3) return
    const range = selection.getRangeAt(0)
    if (!scrollRef.value?.contains(range.commonAncestorContainer)) return
    const rect = range.getBoundingClientRect()
    selectionQuote.value = {x: rect.left + rect.width / 2, y: rect.top, text: text.slice(0, 1000)}
  })
}

function attachQuote() {
  quote.value = selectionQuote.value?.text ?? null
  selectionQuote.value = null
  window.getSelection()?.removeAllRanges()
}

/** Shared dispatch: optimistic user message, then a fire-and-forget call. The
 *  reply streams in through onEvent; the session.idle event reconciles. */
async function dispatch(optimisticParts: ChatMessage['parts'], call: () => Promise<unknown>) {
  if (busy.value) return
  input.value = ''
  sending.value = true
  sessionBusy.value = true
  messages.value = [...messages.value, {info: {id: `local-${Date.now()}`, role: 'user'}, parts: optimisticParts}]
  try {
    await call()
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
    sessionBusy.value = false
  } finally {
    sending.value = false
  }
}

async function send(text: string, files: OutgoingFile[]) {
  const parts = [...filePartsFrom(files), ...(text ? [{type: 'text', text}] : [])]
  // promptAsync returns as soon as the server accepts — streaming does the rest.
  await dispatch(parts, () =>
    client!.session.promptAsync({
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
  <div class="flex h-full flex-col overflow-hidden bg-background">
    <div v-if="connectError || sessionsStore.connectError"
         class="flex items-center gap-2 border-b border-border/60 bg-destructive/6 px-5 py-2.5 text-sm text-destructive">
      <AlertCircleIcon class="size-4 shrink-0"/>
      {{ connectError ?? sessionsStore.connectError }}
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
                  @new-session="sessionsStore.createBlank(projectId)"
                  @delete="sessionsStore.remove(projectId, sessionId)"
              />

              <!-- Messages -->
              <div class="relative z-10 min-h-0 flex-1">
                <ChatMinimap :items="minimapItems" :scroll-el="scrollRef" />
                <div
                    ref="scrollRef"
                    class="relative h-full flex-1 overflow-y-auto bg-background px-4 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
                    @mouseup="onThreadMouseUp"
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
                          :data-turn-id="turn.user?.info.id"
                          :user="turn.user"
                          :assistant="turn.assistant"
                          :agents="agents"
                          :busy="busy && i === turns.length - 1"
                          @fork="forkFrom"
                          @rewind="rewindTo"
                      />

                      <!-- Working indicator: concrete activity when known, animation as fallback -->
                      <div v-if="busy" :class="cn('space-y-2', turns.length > 0 && 'mt-12')">
                        <div class="flex items-center gap-2 py-1 text-xs text-muted-foreground transition-colors relative">
                          <Logo variant="symbol" class="h-4 w-auto shrink-0 absolute -left-7 top-1"/>
                          <span v-if="activity" class="truncate font-mono text-xs text-muted-foreground/80">{{ activity }}</span>
                          <AnimatedThinkingText v-else />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sub-session relations: parent link and spawned children -->
              <div
                v-if="parent || children.length > 0"
                :class="cn('relative z-10 mx-auto w-full shrink-0 px-2 pb-1.5 sm:px-4 transition-[max-width] duration-300 ease-out', !panelOpen ? 'max-w-256' : 'max-w-224')"
              >
                <div class="flex items-center gap-1.5 overflow-x-auto px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  <button
                    v-if="parent"
                    type="button"
                    class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    @click="selectSession(parent.id)"
                  >
                    <CornerLeftUp class="size-3" />
                    <span class="max-w-48 truncate">{{ parent.title || 'Parent session' }}</span>
                  </button>
                  <button
                    v-for="child in children"
                    :key="child.id"
                    type="button"
                    class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    @click="selectSession(child.id)"
                  >
                    <GitBranch class="size-3" />
                    <span class="max-w-48 truncate">{{ child.title || 'Sub-session' }}</span>
                  </button>
                </div>
              </div>

              <!-- Composer -->
              <SessionChatInput
                  v-model="input"
                  v-model:model="selectedModel"
                  v-model:agent="selectedAgent"
                  v-model:quote="quote"
                  :busy="busy"
                  :wide="!panelOpen"
                  :agents="agents"
                  :models="models"
                  :commands="commands"
                  :context="context"
                  :loading-selectors="loadingSelectors"
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

        <!-- Floating quote button over selected thread text -->
        <Teleport to="body">
          <button
            v-if="selectionQuote"
            type="button"
            class="fixed z-50 inline-flex -translate-x-1/2 -translate-y-[calc(100%+6px)] cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-popover px-2.5 py-1 text-xs font-medium text-foreground shadow-md animate-in fade-in-0 zoom-in-[0.97] duration-150 hover:bg-muted"
            :style="{ left: `${selectionQuote.x}px`, top: `${selectionQuote.y}px` }"
            @mousedown.prevent="attachQuote"
          >
            <TextQuote class="size-3" />
            Quote in reply
          </button>
        </Teleport>

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
</template>
