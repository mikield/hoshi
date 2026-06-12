<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { Logo, cn, AnimatedThinkingText, ChatMinimap, QuestionPrompt, Skeleton } from '@hoshi/ui'
import { AlertCircle as AlertCircleIcon, TextQuote } from 'lucide-vue-next'
import type { PanelView } from '~/components/WorkspaceSidePanel.vue'
import {
  createOpencodeClient,
  contextUsage,
  type OpencodeClient,
  type OpencodeEvent,
  type SessionInfo,
} from '~/composables/useOpencode'
import { useSessionThread } from '~/composables/useSessionThread'
import { useSessionRelations } from '~/composables/useSessionRelations'
import { useQuoteSelection } from '~/composables/useQuoteSelection'

// The project layout owns the shell + session list; the stable key keeps this
// page mounted across session switches — the sessionId watcher swaps the
// thread in place instead of remounting.
definePageMeta({ middleware: 'auth', layout: 'project', key: 'project-session' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const sessionId = computed(() => route.params.sessionId as string)

let client: OpencodeClient | null = null
let unsubscribe: (() => void) | null = null

const sessionsStore = useSessionsStore()
const eventsStore = useEventsStore()
const catalog = useCatalogStore()
const { models, agents, commands, loading: loadingSelectors } = storeToRefs(catalog)
const { selectedModel, selectedAgent } = storeToRefs(useChatStore())

const {
  messages,
  loadingMessages,
  busy,
  connectError: threadError,
  turns,
  minimapItems,
  activity,
  pendingQuestion,
  contentVersion,
  loadMessages,
  replayStatus,
  resetForSession,
  applyEvent: applyThreadEvent,
  send,
  runCommand,
  stop,
  rewindTo,
  forkFrom,
  answerQuestion,
  dismissQuestion,
} = useSessionThread(() => client, projectId, sessionId)

const {
  children,
  parent,
  load: loadRelations,
  applyEvent: applyRelationsEvent,
} = useSessionRelations(() => client, sessionId)

const input = ref('')
const quote = ref<string | null>(null)
const scrollRef = ref<HTMLDivElement | null>(null)
const { selectionQuote, onMouseUp: onThreadMouseUp, attach: attachQuote } = useQuoteSelection(scrollRef, quote)

const context = computed(() => contextUsage(messages.value, models.value))
const connectError = computed(() => threadError.value ?? sessionsStore.connectError)

function onSend(text: string, files: Parameters<typeof send>[1]) {
  input.value = ''
  void send(text, files)
}

function onCommand(name: string, args: string) {
  input.value = ''
  void runCommand(name, args)
}

function selectSession(id: string) {
  navigateTo(`/projects/${projectId.value}/sessions/${id}`)
}

// ── Side panel ───────────────────────────────────────────────────────────────

const panelOpen = ref(false)
const panelView = ref<PanelView>('actions')
const splitPct = ref(50)
const dragRef = ref<HTMLDivElement | null>(null)
const dragging = ref(false)

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

function onGlobalKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && (e.key === 'i' || e.key === 'I')) {
    e.preventDefault()
    panelOpen.value = !panelOpen.value
  }
}

// ── Auto-scroll — coalesced to one frame, instant while streaming ────────────

let scrollQueued = false
watch(contentVersion, () => {
  if (scrollQueued) return
  scrollQueued = true
  requestAnimationFrame(() => {
    scrollQueued = false
    scrollRef.value?.scrollTo({
      top: scrollRef.value.scrollHeight,
      behavior: busy.value ? 'auto' : 'smooth',
    })
  })
})

// ── Lifecycle ────────────────────────────────────────────────────────────────

/** Every live-data consumer picks the events it cares about — the sessions
 *  store subscribes separately in the project layout. */
function onEvent(event: OpencodeEvent) {
  applyThreadEvent(event)
  applyRelationsEvent(event)
  if (event.type === 'session.deleted' && (event.properties.info as SessionInfo).id === sessionId.value) {
    navigateTo(`/projects/${projectId.value}`)
  }
}

onMounted(async () => {
  client = await createOpencodeClient()
  unsubscribe = eventsStore.subscribe(onEvent)
  // The layout loads the list too — this await only orders the dead-session
  // check in loadMessages after the list is known (no-op when already loaded).
  await sessionsStore.load(projectId.value)
  await loadMessages(sessionId.value)
  void replayStatus(sessionId.value)
  void loadRelations(sessionId.value)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('keydown', onGlobalKey)
  void catalog.load()
})

onBeforeUnmount(() => {
  unsubscribe?.()
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
  window.removeEventListener('keydown', onGlobalKey)
})

watch([projectId, sessionId], ([, id]) => {
  if (!id) return
  resetForSession()
  quote.value = null
  loadMessages(id)
  void replayStatus(id)
  void loadRelations(id)
})
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-background">
    <div
      v-if="connectError"
      class="flex items-center gap-2 border-b border-border/60 bg-destructive/6 px-5 py-2.5 text-sm text-destructive"
    >
      <AlertCircleIcon class="size-4 shrink-0" />
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
                <div
                  role="log"
                  :class="cn('mx-auto w-full min-w-0 px-3 transition-[max-width] duration-300 ease-out sm:px-6', panelOpen ? 'max-w-4xl' : 'max-w-5xl')"
                >
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
                      <div class="relative flex items-center gap-2 py-1 text-xs text-muted-foreground transition-colors">
                        <Logo variant="symbol" class="absolute -left-7 top-1 h-4 w-auto shrink-0" />
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
              :class="cn('relative z-10 mx-auto w-full shrink-0 px-2 pb-1.5 sm:px-4 transition-[max-width] duration-300 ease-out', !panelOpen ? 'max-w-5xl' : 'max-w-4xl')"
            >
              <SessionRelationChips :parent="parent" :children="children" @select="selectSession" />
            </div>

            <!-- The agent is waiting on an answer -->
            <div
              v-if="pendingQuestion"
              :class="cn('relative z-10 mx-auto w-full shrink-0 px-2 pb-1.5 sm:px-4 transition-[max-width] duration-300 ease-out', !panelOpen ? 'max-w-5xl' : 'max-w-4xl')"
            >
              <QuestionPrompt
                :key="pendingQuestion.id"
                :request-id="pendingQuestion.id"
                :questions="pendingQuestion.questions"
                @reply="answerQuestion"
                @reject="dismissQuestion"
              />
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
              :placeholder="pendingQuestion ? 'Type your answer…' : undefined"
              autofocus
              @send="onSend"
              @command="onCommand"
              @stop="stop"
            />
          </div>
        </div>
      </div>

      <!-- Resize handle -->
<!--      <div v-if="panelOpen" class="relative z-20 w-0">-->
<!--        <div-->
<!--          role="separator"-->
<!--          aria-orientation="vertical"-->
<!--          class="absolute inset-y-0 -left-1.5 -right-1.5 cursor-col-resize bg-transparent hover:bg-border/20"-->
<!--          @mousedown="startDrag"-->
<!--        />-->
<!--      </div>-->

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
<!--      <div v-if="panelOpen" class="relative min-w-0 flex-1 overflow-hidden bg-background">-->
<!--        <div class="h-full bg-background pb-6 pl-1.5 pr-3 pt-3 sm:pr-4">-->
<!--          <div class="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-md border border-border bg-card" style="min-height: 0">-->
<!--            <WorkspaceSidePanel :view="panelView" :messages="messages" @change-view="panelView = $event" @close="panelOpen = false" />-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>
