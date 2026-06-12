<script setup lang="ts">
import {ref, computed, watch, nextTick, onBeforeUnmount} from 'vue'
import {Logo, cn, AnimatedThinkingText, ChatMinimap, QuestionPrompt, Skeleton} from '@hoshi/ui'
import {AlertCircle as AlertCircleIcon, TextQuote} from 'lucide-vue-next'
import {toast} from 'vue-sonner'
import type {PanelView} from '~/components/WorkspaceSidePanel.vue'
import {
  createOpencodeClient,
  contextUsage,
  type OpencodeClient,
  type OpencodeEvent,
  type SessionInfo,
} from '~/composables/useOpencode'
import {useSessionThread} from '~/composables/useSessionThread'
import {useSessionRelations} from '~/composables/useSessionRelations'
import {useQuoteSelection} from '~/composables/useQuoteSelection'

// The project layout owns the shell + session list; the stable key keeps this
// page mounted across session switches — the sessionId watcher swaps the
// thread in place instead of remounting.
definePageMeta({middleware: 'auth', layout: 'project', key: 'project-session'})

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const sessionId = computed(() => route.params.sessionId as string)

let client: OpencodeClient | null = null
let unsubscribe: (() => void) | null = null

const sessionsStore = useSessionsStore()
const eventsStore = useEventsStore()
const catalog = useCatalogStore()
const {models, agents, commands, loading: loadingSelectors} = storeToRefs(catalog)
const {selectedModel, selectedAgent} = storeToRefs(useChatStore())

const thread = useSessionThread(() => client, projectId, sessionId)
const relations = useSessionRelations(() => client, sessionId)

const input = ref('')
const quote = ref<string | null>(null)
const scrollRef = ref<HTMLDivElement | null>(null)
const {selectionQuote, onMouseUp: onThreadMouseUp, attach: attachQuote} = useQuoteSelection(scrollRef, quote)

const context = computed(() => contextUsage(thread.messages.value, models.value))
const connectError = computed(() => thread.connectError.value ?? sessionsStore.connectError)

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

// ── Lifecycle ────────────────────────────────────────────────────────────────

/** Every live-data consumer picks the events it cares about — the sessions
 *  store subscribes separately in the project layout. */
function onEvent(event: OpencodeEvent) {
  thread.applyEvent(event)
  relations.applyEvent(event)
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
  await thread.loadMessages(sessionId.value)
  void thread.replayStatus(sessionId.value)
  void relations.load(sessionId.value)
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
  thread.resetForSession()
  quote.value = null
  thread.loadMessages(id)
  void thread.replayStatus(id)
  void relations.load(id)
})

watch(
  thread.messages,
  () => {
    nextTick(() => {
      scrollRef.value?.scrollTo({top: scrollRef.value.scrollHeight, behavior: 'smooth'})
    })
  },
  {deep: true},
)

function selectSession(id: string) {
  navigateTo(`/projects/${projectId.value}/sessions/${id}`)
}

const questionPromptRef = ref<InstanceType<typeof QuestionPrompt> | null>(null)

function onSend(text: string, files: Parameters<typeof thread.send>[1]) {
  // While the agent waits on a question, the composer answers it.
  if (thread.pendingQuestion.value && files.length === 0) {
    if (!questionPromptRef.value?.acceptsCustom) {
      toast.error('Pick one of the options above.')
      return
    }
    input.value = ''
    questionPromptRef.value.submitCustom(text)
    return
  }
  input.value = ''
  void thread.send(text, files)
}

function onCommand(name: string, args: string) {
  input.value = ''
  void thread.runCommand(name, args)
}
</script>

<template>
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
                @new-session="sessionsStore.createBlank(projectId)"
                @delete="sessionsStore.remove(projectId, sessionId)"
            />

            <!-- Messages -->
            <div class="relative z-10 min-h-0 flex-1">
              <ChatMinimap :items="thread.minimapItems.value" :scroll-el="scrollRef" />
              <div
                  ref="scrollRef"
                  class="relative h-full flex-1 overflow-y-auto bg-background px-4 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
                  @mouseup="onThreadMouseUp"
              >
                <div role="log" :class="cn('mx-auto w-full min-w-0 px-3 transition-[max-width] duration-300 ease-out sm:px-6', panelOpen ? 'max-w-4xl' : 'max-w-5xl')">
                  <!-- Initial-load skeleton: a user bubble and a reply, matching thread shapes. -->
                  <div v-if="thread.loadingMessages.value && thread.turns.value.length === 0" class="flex min-w-0 flex-col gap-10 pt-8">
                    <Skeleton class="ml-auto h-10 w-2/5 rounded-2xl" />
                    <div class="space-y-2.5">
                      <Skeleton class="h-4 w-11/12" />
                      <Skeleton class="h-4 w-4/5" />
                      <Skeleton class="h-4 w-3/5" />
                    </div>
                  </div>
                  <div v-else class="flex min-w-0 flex-col pt-8">
                    <SessionTurn
                        v-for="(turn, i) in thread.turns.value"
                        :key="turn.user?.info.id ?? i"
                        :class="i !== 0 && 'mt-12'"
                        :data-turn-id="turn.user?.info.id"
                        :user="turn.user"
                        :assistant="turn.assistant"
                        :agents="agents"
                        :busy="thread.busy.value && i === thread.turns.value.length - 1"
                        @fork="thread.forkFrom"
                        @rewind="thread.rewindTo"
                    />

                    <!-- Working indicator: concrete activity when known, animation as fallback -->
                    <div v-if="thread.busy.value" :class="cn('space-y-2', thread.turns.value.length > 0 && 'mt-12')">
                      <div class="flex items-center gap-2 py-1 text-xs text-muted-foreground transition-colors relative">
                        <Logo variant="symbol" class="h-4 w-auto shrink-0 absolute -left-7 top-1"/>
                        <span v-if="thread.activity.value" class="truncate font-mono text-xs text-muted-foreground/80">{{ thread.activity.value }}</span>
                        <AnimatedThinkingText v-else />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sub-session relations: parent link and spawned children -->
            <div
              v-if="relations.parent.value || relations.children.value.length > 0"
              :class="cn('relative z-10 mx-auto w-full shrink-0 px-2 pb-1.5 sm:px-4 transition-[max-width] duration-300 ease-out', !panelOpen ? 'max-w-256' : 'max-w-224')"
            >
              <SessionRelationChips
                :parent="relations.parent.value"
                :children="relations.children.value"
                @select="selectSession"
              />
            </div>

            <!-- The agent is waiting on an answer -->
            <div
              v-if="thread.pendingQuestion.value"
              :class="cn('relative z-10 mx-auto w-full shrink-0 px-2 pb-1.5 sm:px-4 transition-[max-width] duration-300 ease-out', !panelOpen ? 'max-w-256' : 'max-w-224')"
            >
              <QuestionPrompt
                ref="questionPromptRef"
                :key="thread.pendingQuestion.value.id"
                :request-id="thread.pendingQuestion.value.id"
                :questions="thread.pendingQuestion.value.questions"
                @reply="thread.answerQuestion"
                @reject="thread.dismissQuestion"
              />
            </div>

            <!-- Composer -->
            <SessionChatInput
                v-model="input"
                v-model:model="selectedModel"
                v-model:agent="selectedAgent"
                v-model:quote="quote"
                :busy="thread.busy.value"
                :wide="!panelOpen"
                :agents="agents"
                :models="models"
                :commands="commands"
                :context="context"
                :loading-selectors="loadingSelectors"
                :placeholder="thread.pendingQuestion.value ? 'Type your answer…' : undefined"
                autofocus
                @send="onSend"
                @command="onCommand"
                @stop="thread.stop"
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
            <WorkspaceSidePanel :view="panelView" :messages="thread.messages.value" @change-view="panelView = $event" @close="panelOpen = false"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
