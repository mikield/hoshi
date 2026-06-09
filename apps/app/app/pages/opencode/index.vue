<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
  Button,
  Textarea,
  ScrollArea,
  EmptyState,
  EntityAvatar,
  UserAvatar,
  ChatBubble,
  ChatInputShell,
  Badge,
  cn,
} from '@hoshi/ui'
import { Plus, Send, MessageSquare, Bot, AlertCircle, Loader2 } from 'lucide-vue-next'
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

const user = useAuthUser()

let client: OpencodeClient | null = null
const connectError = ref<string | null>(null)
const sessions = ref<SessionInfo[]>([])
const activeSessionId = ref<string | null>(null)
const messages = ref<ChatMessage[]>([])
const input = ref('')
const sending = ref(false)
const loadingSessions = ref(true)
const scrollRef = ref<HTMLDivElement | null>(null)

const activeSession = computed(() => sessions.value.find((s) => s.id === activeSessionId.value))
const modelLabel = `${OPENCODE_MODEL.providerID}/${OPENCODE_MODEL.modelID}`

onMounted(async () => {
  client = await createOpencodeClient()
  await refreshSessions()
})

watch(activeSessionId, (id) => {
  if (id) loadMessages(id)
  else messages.value = []
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
    const items = unwrap<SessionInfo[]>(list)
    sessions.value = items
    connectError.value = null
    if (!activeSessionId.value && items?.length) activeSessionId.value = items[0]!.id
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
  } finally {
    loadingSessions.value = false
  }
}

async function loadMessages(sessionId: string) {
  try {
    const res = await client!.session.messages({ path: { id: sessionId } })
    messages.value = unwrap<ChatMessage[]>(res)
  } catch {
    messages.value = []
  }
}

async function createSession() {
  try {
    const res = await client!.session.create({ body: { title: 'New session' } })
    const session = unwrap<SessionInfo>(res)
    sessions.value = [session, ...sessions.value]
    activeSessionId.value = session.id
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
  }
}

async function send() {
  const text = input.value.trim()
  if (!text || !activeSessionId.value || sending.value) return
  input.value = ''
  sending.value = true
  messages.value = [...messages.value, { info: { id: `local-${Date.now()}`, role: 'user' }, parts: [{ type: 'text', text }] }]
  try {
    await client!.session.prompt({
      path: { id: activeSessionId.value },
      body: { model: OPENCODE_MODEL, parts: [{ type: 'text', text }] },
    })
    await loadMessages(activeSessionId.value)
  } catch {
    connectError.value = OPENCODE_CONNECT_ERROR
  } finally {
    sending.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-background">
    <AppHeader v-if="user" :user="user" breadcrumb="Chat" />
    <div class="flex min-h-0 flex-1 overflow-hidden">
      <!-- Session sidebar -->
      <div class="flex w-[260px] shrink-0 flex-col border-r border-border/60 bg-muted/[0.18]">
        <div class="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-3">
          <span class="text-sm font-medium text-foreground">Sessions</span>
          <Button size="icon" variant="ghost" class="size-7" title="New session" @click="createSession">
            <Plus class="size-4" />
          </Button>
        </div>
        <ScrollArea class="flex-1">
          <div class="flex flex-col gap-0.5 p-2">
            <div v-if="loadingSessions" class="flex items-center gap-2 px-2 py-3 text-xs text-muted-foreground">
              <Loader2 class="size-3.5 animate-spin" />
              Loading sessions…
            </div>
            <div v-if="!loadingSessions && sessions.length === 0 && !connectError" class="px-2 py-3 text-xs text-muted-foreground">
              No sessions yet.
            </div>
            <button
              v-for="s in sessions"
              :key="s.id"
              type="button"
              :class="cn(
                'flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                s.id === activeSessionId
                  ? 'bg-primary/[0.05] border-l-2 border-l-primary text-foreground'
                  : 'border-l-2 border-l-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )"
              @click="activeSessionId = s.id"
            >
              <MessageSquare class="size-3.5 shrink-0 text-muted-foreground/60" />
              <span class="truncate">{{ s.title || s.id }}</span>
            </button>
          </div>
        </ScrollArea>
      </div>

      <!-- Chat -->
      <div class="flex min-w-0 flex-1 flex-col">
        <div class="flex h-12 items-center gap-2 border-b border-border/60 px-5">
          <span class="text-sm font-medium text-foreground">{{ activeSession?.title || activeSession?.id || 'Select a session' }}</span>
          <Badge size="sm" variant="outline" class="font-mono">{{ modelLabel }}</Badge>
        </div>

        <div v-if="connectError" class="flex items-center gap-2 border-b border-border/60 bg-destructive/[0.06] px-5 py-2.5 text-sm text-destructive">
          <AlertCircle class="size-4 shrink-0" />
          {{ connectError }}
        </div>

        <div ref="scrollRef" class="flex-1 overflow-y-auto px-5 py-6">
          <EmptyState v-if="!activeSessionId" :icon="MessageSquare" title="No session selected">
            <template #description>Create a new session to start chatting with your local OpenCode server.</template>
            <template #action><Button @click="createSession">New session</Button></template>
          </EmptyState>
          <EmptyState v-else-if="messages.length === 0" :icon="Bot" title="Say hello">
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
                :placeholder="activeSessionId ? 'Message OpenCode…' : 'Create a session to start chatting'"
                :disabled="!activeSessionId"
                class="min-h-[52px] resize-none border-0 bg-transparent px-4 pt-3 shadow-none focus-visible:ring-0"
                @keydown="onKeydown"
              />
              <div class="flex items-center justify-between px-3 pb-2.5">
                <UserAvatar v-if="user" size="sm" :email="user.email" :name="user.name" />
                <Button size="icon" class="size-8 rounded-full" :disabled="!input.trim() || !activeSessionId || sending" @click="send">
                  <Send class="size-4" />
                </Button>
              </div>
            </ChatInputShell>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
