<script setup lang="ts">
import {ref, computed, watch, nextTick, onBeforeUnmount} from 'vue'
import {Logo, cn, AnimatedThinkingText} from '@hoshi/ui'
import {AlertCircle as AlertCircleIcon} from 'lucide-vue-next'
import type {PanelView} from '~/components/WorkspaceSidePanel.vue'
import {
  createOpencodeClient,
  unwrap,
  partsText,
  OPENCODE_MODEL,
  OPENCODE_CONNECT_ERROR,
  type OpencodeClient,
  type SessionInfo,
  type ChatMessage,
} from '~/composables/useOpencode'

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
const input = ref('')
const sending = ref(false)
const scrollRef = ref<HTMLDivElement | null>(null)

const panelOpen = ref(false)
const panelView = ref<PanelView>('actions')
const splitPct = ref(50)
const dragRef = ref<HTMLDivElement | null>(null)
const dragging = ref(false)

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
  return out.filter((t) => (t.user && partsText(t.user.parts)) || t.assistant.some((m) => partsText(m.parts)))
})

onMounted(async () => {
  client = await createOpencodeClient()
  await refreshSessions()
  await loadMessages(sessionId.value)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('keydown', onGlobalKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
  window.removeEventListener('keydown', onGlobalKey)
})

watch(sessionId, (id) => {
  if (id) loadMessages(id)
})

watch(messages, () => {
  nextTick(() => {
    scrollRef.value?.scrollTo({top: scrollRef.value.scrollHeight, behavior: 'smooth'})
  })
})

function onGlobalKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && (e.key === 'i' || e.key === 'I')) {
    e.preventDefault()
    panelOpen.value = !panelOpen.value
  }
}

async function refreshSessions() {
  loadingSessions.value = true
  try {
    const list = await client!.session.list()
    sessions.value = unwrap<SessionInfo[]>(list)
    connectError.value = null
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
  } finally {
    loadingSessions.value = false
  }
}

async function loadMessages(id: string) {
  try {
    const res = await client!.session.messages({path: {id}})
    messages.value = unwrap<ChatMessage[]>(res)
  } catch {
    messages.value = []
  }
}

async function createSession() {
  if (creating.value) return
  creating.value = true
  try {
    const res = await client!.session.create({body: {title: 'New session'}})
    const created = unwrap<SessionInfo>(res)
    sessions.value = [created, ...sessions.value]
    await navigateTo(`/projects/${projectId.value}/sessions/${created.id}`)
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
  } finally {
    creating.value = false
  }
}

async function deleteSession(id: string) {
  try {
    await client!.session.delete({path: {id}})
    sessions.value = sessions.value.filter((s) => s.id !== id)
    if (id === sessionId.value) {
      await navigateTo(`/projects/${projectId.value}`)
    }
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
  }
}

async function send(text: string) {
  if (sending.value) return
  input.value = ''
  sending.value = true
  messages.value = [...messages.value, {info: {id: `local-${Date.now()}`, role: 'user'}, parts: [{type: 'text', text}]}]
  try {
    await client!.session.prompt({
      path: {id: sessionId.value},
      body: {model: OPENCODE_MODEL, parts: [{type: 'text', text}]}
    })
    await loadMessages(sessionId.value)
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
  } finally {
    sending.value = false
  }
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
                  <div role="log" class="mx-auto w-full min-w-0 max-w-3xl px-3 sm:px-6">
                    <div class="flex min-w-0 flex-col pt-8">
                      <div
                          v-for="(turn, i) in turns"
                          :key="turn.user?.info.id ?? i"
                          :class="cn('space-y-3', i !== 0 && 'mt-12')"
                      >
                        <!-- User message -->
                        <div v-if="turn.user && partsText(turn.user.parts)" class="flex justify-end">
                          <div
                              class="flex max-w-[90%] flex-col overflow-hidden rounded-3xl rounded-br-lg border bg-card">
                            <p class="min-w-0 whitespace-pre-wrap wrap-break-word px-4 py-3 text-sm leading-relaxed">
                              {{ partsText(turn.user.parts) }}</p>
                          </div>
                        </div>

                        <!-- Assistant response -->
                        <template v-if="turn.assistant.some((m) => partsText(m.parts))">
                          <div class="flex flex-row relative">
                            <Logo variant="symbol" class="h-4 w-auto shrink-0 absolute -left-7 top-1"/>
                            <div>
                              <div v-for="m in turn.assistant" :key="m.info.id">
                                <MDC :value="partsText(m.parts)" v-if="partsText(m.parts)" class="whitespace-pre-wrap text-sm leading-relaxed">
                                </MDC>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>

                      <!-- Working indicator -->
                      <div v-if="!sending"  :class="cn('space-y-2', turns.length > 0 && 'mt-12')">
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
              <SessionChatInput v-model="input" :busy="sending" autofocus @send="send"/>
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
              <WorkspaceSidePanel :view="panelView" @change-view="panelView = $event" @close="panelOpen = false"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProjectShell>
</template>
