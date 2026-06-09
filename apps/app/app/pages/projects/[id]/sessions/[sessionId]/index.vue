<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { Button, EmptyState, EntityAvatar, ChatBubble, ChatInputShell, Textarea } from '@hoshi/ui'
import { Send, Bot, AlertCircle, Loader2, ListTree } from 'lucide-vue-next'
import type { PanelView } from '~/components/WorkspaceSidePanel.vue'
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

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const sessionId = computed(() => route.params.sessionId as string)

let client: OpencodeClient | null = null
const connectError = ref<string | null>(null)
const sessions = ref<SessionInfo[]>([])
const loadingSessions = ref(true)
const messages = ref<ChatMessage[]>([])
const input = ref('')
const sending = ref(false)
const scrollRef = ref<HTMLDivElement | null>(null)

const panelOpen = ref(true)
const panelView = ref<PanelView>('actions')
const splitPct = ref(52)
const dragRef = ref<HTMLDivElement | null>(null)
const dragging = ref(false)

const activeSession = computed(() => sessions.value.find((s) => s.id === sessionId.value))

onMounted(async () => {
  client = await createOpencodeClient()
  await refreshSessions()
  await loadMessages(sessionId.value)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
})

watch(sessionId, (id) => {
  if (id) loadMessages(id)
})

watch(messages, () => {
  nextTick(() => {
    scrollRef.value?.scrollTo({ top: scrollRef.value.scrollHeight, behavior: 'smooth' })
  })
})

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
    const res = await client!.session.messages({ path: { id } })
    messages.value = unwrap<ChatMessage[]>(res)
  } catch {
    messages.value = []
  }
}

async function createSession() {
  try {
    const res = await client!.session.create({ body: { title: 'New session' } })
    const created = unwrap<SessionInfo>(res)
    sessions.value = [created, ...sessions.value]
    await navigateTo(`/projects/${projectId.value}/sessions/${created.id}`)
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
  }
}

async function send() {
  const text = input.value.trim()
  if (!text || sending.value) return
  input.value = ''
  sending.value = true
  messages.value = [...messages.value, { info: { id: `local-${Date.now()}`, role: 'user' }, parts: [{ type: 'text', text }] }]
  try {
    await client!.session.prompt({ path: { id: sessionId.value }, body: { model: OPENCODE_MODEL, parts: [{ type: 'text', text }] } })
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
  splitPct.value = Math.min(70, Math.max(30, pct))
}

function onUp() {
  dragging.value = false
  document.body.style.cursor = ''
}

function startDrag() {
  dragging.value = true
  document.body.style.cursor = 'col-resize'
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function selectSession(id: string) {
  navigateTo(`/projects/${projectId.value}/sessions/${id}`)
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <WorkspaceSidebar
      :project-id="projectId"
      :sessions="sessions"
      :active-session-id="sessionId"
      :loading="loadingSessions"
      @select="selectSession"
      @create="createSession"
    />

    <div class="flex min-h-0 flex-1 flex-col overflow-hidden md:my-3 md:mr-3 md:rounded-xl md:border md:border-border/60">
      <div v-if="connectError" class="flex items-center gap-2 border-b border-border/60 bg-destructive/[0.06] px-5 py-2.5 text-sm text-destructive">
        <AlertCircle class="size-4 shrink-0" />
        {{ connectError }}
      </div>

      <div ref="dragRef" class="flex min-h-0 flex-1 overflow-hidden">
        <!-- Chat pane -->
        <div class="flex min-w-0 flex-col overflow-hidden" :style="{ width: panelOpen ? `${splitPct}%` : '100%' }">
          <div class="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border/60 px-5">
            <span class="truncate text-sm font-medium text-foreground">{{ activeSession?.title || activeSession?.id || sessionId }}</span>
            <Button v-if="!panelOpen" size="sm" variant="outline" class="gap-1.5" @click="panelOpen = true">
              <ListTree class="size-3.5" />
              Show panel
            </Button>
          </div>
          <div ref="scrollRef" class="flex-1 overflow-y-auto px-5 py-6">
            <EmptyState v-if="messages.length === 0" :icon="Bot" title="Say hello">
              <template #description>Send a message to kick off the conversation.</template>
            </EmptyState>
            <div v-else class="mx-auto flex max-w-3xl flex-col gap-5">
              <template v-for="m in messages" :key="m.info.id">
                <ChatBubble v-if="partsText(m.parts) && m.info.role === 'user'">
                  <p class="whitespace-pre-wrap text-sm text-foreground">{{ partsText(m.parts) }}</p>
                </ChatBubble>
                <div v-else-if="partsText(m.parts)" class="flex items-start gap-2.5">
                  <EntityAvatar size="sm" :icon="Bot" class="mt-0.5 shrink-0" />
                  <p class="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{{ partsText(m.parts) }}</p>
                </div>
              </template>
              <div v-if="sending" class="flex items-center gap-2.5 text-sm text-muted-foreground">
                <EntityAvatar size="sm" :icon="Bot" class="shrink-0" />
                <span class="inline-flex items-center gap-1.5"><Loader2 class="size-3.5 animate-spin" />Thinking…</span>
              </div>
            </div>
          </div>
          <div class="border-t border-border/60 px-5 py-4">
            <div class="mx-auto max-w-3xl">
              <ChatInputShell>
                <Textarea
                  v-model="input"
                  placeholder="Message OpenCode…"
                  class="min-h-[52px] resize-none border-0 bg-transparent px-4 pt-3 shadow-none focus-visible:ring-0"
                  @keydown="onKeydown"
                />
                <div class="flex items-center justify-end px-3 pb-2.5">
                  <Button size="icon" class="size-8 rounded-full" :disabled="!input.trim() || sending" @click="send">
                    <Send class="size-4" />
                  </Button>
                </div>
              </ChatInputShell>
            </div>
          </div>
        </div>

        <!-- Drag handle -->
        <div
          v-if="panelOpen"
          role="separator"
          aria-orientation="vertical"
          class="group flex w-px shrink-0 cursor-col-resize items-center justify-center bg-border/60 hover:bg-border"
          @mousedown="startDrag"
        >
          <span class="h-8 w-[3px] rounded-full bg-border/0 transition-colors group-hover:bg-foreground/20" />
        </div>

        <!-- Side panel -->
        <div v-if="panelOpen" class="flex min-w-0 flex-1 flex-col overflow-hidden border-l border-border/60">
          <WorkspaceSidePanel :view="panelView" @change-view="panelView = $event" @close="panelOpen = false" />
        </div>
      </div>
    </div>
  </div>
</template>
