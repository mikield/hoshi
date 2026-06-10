<script setup lang="ts">
import { ref, computed } from 'vue'
import { EntityAvatar, cn } from '@hoshi/ui'
import { AlertCircle, ArrowUp, Building2, Globe, Search, Presentation } from 'lucide-vue-next'
import {
  createOpencodeClient,
  unwrap,
  OPENCODE_MODEL,
  OPENCODE_CONNECT_ERROR,
  type OpencodeClient,
  type SessionInfo,
} from '~/composables/useOpencode'
import { useProjects } from '~/composables/useProjects'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const { projects } = useProjects()
const projectName = computed(() => projects.value.find((p) => p.id === projectId.value)?.name ?? 'Your project')

const STARTERS = [
  { icon: Building2, label: 'Research a competitor' },
  { icon: Globe, label: 'Build a landing page' },
  { icon: Search, label: 'Audit this codebase' },
  { icon: Presentation, label: 'Draft a project brief' },
]

let client: OpencodeClient | null = null
const input = ref('')
const creating = ref(false)
const error = ref<string | null>(null)
const sessions = ref<SessionInfo[]>([])
const loadingSessions = ref(true)

onMounted(async () => {
  client = await createOpencodeClient()
  try {
    const list = await client.session.list()
    sessions.value = unwrap<SessionInfo[]>(list)
  } catch {
    error.value = OPENCODE_CONNECT_ERROR
  } finally {
    loadingSessions.value = false
  }
})

async function startSession(prompt?: string) {
  const text = (prompt ?? input.value).trim()
  if (creating.value) return
  creating.value = true
  error.value = null
  try {
    if (!client) client = await createOpencodeClient()
    const res = await client.session.create({ body: { title: text || 'New session' } })
    const created = unwrap<{ id: string }>(res)
    if (text) {
      client.session
        .prompt({ path: { id: created.id }, body: { model: OPENCODE_MODEL, parts: [{ type: 'text', text }] } })
        .catch(() => {})
    }
    await navigateTo(`/projects/${projectId.value}/sessions/${created.id}`)
  } catch {
    error.value = OPENCODE_CONNECT_ERROR
    creating.value = false
  }
}

async function deleteSession(id: string) {
  try {
    await client!.session.delete({ path: { id } })
    sessions.value = sessions.value.filter((s) => s.id !== id)
  } catch {
    error.value = OPENCODE_CONNECT_ERROR
  }
}

function applySuggestion(label: string) {
  input.value = label
}

function selectSession(id: string) {
  navigateTo(`/projects/${projectId.value}/sessions/${id}`)
}
</script>

<template>
  <ProjectShell
    :project-id="projectId"
    :sessions="sessions"
    :active-session-id="null"
    :loading="loadingSessions"
    :creating="creating"
    @select="selectSession"
    @create="startSession()"
    @delete="deleteSession"
  >
    <div class="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <!-- Empty-state backdrop -->
      <div
        class="pointer-events-none absolute inset-0 z-0 opacity-40"
        aria-hidden="true"
        :style="{
          backgroundImage: 'radial-gradient(circle, rgba(127,127,127,0.25) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 35%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 35%, black 0%, transparent 70%)',
        }"
      />

      <!-- Hero -->
      <div class="relative z-10 min-h-0 flex-1 overflow-y-auto">
        <div class="mx-auto flex min-h-full w-full max-w-4xl flex-col px-6 py-8">
          <div class="m-auto w-full">
            <div class="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
              <EntityAvatar :label="projectName" size="xl" class="shadow-sm" />
              <h1 class="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{{ projectName }}</h1>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom dock — starter chips over the pinned composer -->
      <div class="relative z-10 shrink-0">
        <div class="mx-auto w-full max-w-[52rem] px-2 pb-6 sm:px-4">
          <p v-if="error" class="mb-2 flex items-center gap-1.5 px-2 text-sm text-destructive">
            <AlertCircle class="size-3.5 shrink-0" />
            {{ error }}
          </p>

          <div class="flex items-center gap-2 overflow-x-auto px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              v-for="{ icon: Icon, label } in STARTERS"
              :key="label"
              type="button"
              :disabled="creating"
              class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              @click="applySuggestion(label)"
            >
              <component :is="Icon" class="size-3.5" />
              {{ label }}
            </button>
          </div>

          <div :class="cn('mt-2.5 w-full overflow-visible rounded-[24px] border border-border bg-card transition-colors', 'focus-within:border-foreground/20')">
            <div class="flex flex-col gap-2">
              <div class="px-3.5">
                <textarea
                  v-model="input"
                  rows="1"
                  autofocus
                  placeholder="Describe a task to start a session…"
                  class="relative max-h-[200px] min-h-[72px] w-full resize-none overflow-y-auto border-none bg-transparent px-0.5 pb-6 pt-4 text-base leading-relaxed outline-none placeholder:text-muted-foreground sm:text-sm"
                  @keydown.enter.exact.prevent="startSession()"
                />
              </div>
              <div class="mb-1.5 flex items-center justify-between gap-1 pl-2 pr-1.5">
                <div class="flex min-w-0 items-center gap-2" />
                <button
                  type="button"
                  :disabled="creating || !input.trim()"
                  aria-label="Start session"
                  class="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary p-0 text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                  @click="startSession()"
                >
                  <span v-if="creating" class="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <ArrowUp v-else class="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProjectShell>
</template>
