<script setup lang="ts">
import { ref } from 'vue'
import { Button, Textarea, ChatInputShell, EntityAvatar } from '@hoshi/ui'
import { ArrowUp, Bot, Loader2, Building2, Globe, Search, Presentation } from 'lucide-vue-next'
import {
  createOpencodeClient,
  unwrap,
  OPENCODE_MODEL,
  OPENCODE_CONNECT_ERROR,
  type OpencodeClient,
} from '~/composables/useOpencode'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const user = useAuthUser()
const projectId = computed(() => route.params.id as string)

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

onMounted(async () => {
  client = await createOpencodeClient()
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

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    startSession()
  }
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-background">
    <AppHeader v-if="user" :user="user" breadcrumb="Project" />
    <div class="relative flex flex-1 flex-col overflow-hidden">
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
      <div class="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <div class="flex flex-col items-center gap-3">
          <EntityAvatar :icon="Bot" size="xl" class="shadow-sm" />
          <h1 class="text-2xl font-semibold tracking-tight text-foreground">What are we building today?</h1>
          <p class="text-sm text-muted-foreground">Start a session and OpenCode will pick up right where you leave off.</p>
        </div>

        <div class="w-full">
          <p v-if="error" class="mb-2 text-sm text-destructive">{{ error }}</p>
          <ChatInputShell>
            <Textarea
              v-model="input"
              placeholder="Describe what you want to do…"
              class="min-h-[64px] resize-none border-0 bg-transparent px-4 pt-3 text-left shadow-none focus-visible:ring-0"
              @keydown="onKeydown"
            />
            <div class="flex items-center justify-end px-3 pb-2.5">
              <Button size="icon" class="size-8 rounded-full" :disabled="creating" @click="startSession()">
                <Loader2 v-if="creating" class="size-4 animate-spin" />
                <ArrowUp v-else class="size-4" />
              </Button>
            </div>
          </ChatInputShell>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2">
          <button
            v-for="{ icon: Icon, label } in STARTERS"
            :key="label"
            type="button"
            :disabled="creating"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            @click="startSession(label)"
          >
            <component :is="Icon" class="size-3.5" />
            {{ label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
