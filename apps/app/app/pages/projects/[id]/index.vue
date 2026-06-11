<script setup lang="ts">
import { ref, computed } from 'vue'
import { EntityAvatar, ScrollRow } from '@hoshi/ui'
import {
  AlertCircle,
  Building2,
  Bug,
  FileText,
  Globe,
  ListChecks,
  Search,
  ShieldCheck,
  Presentation,
  TestTube2,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  createOpencodeClient,
  unwrap,
  fetchModels,
  fetchAgents,
  fetchCommands,
  filePartsFrom,
  OPENCODE_MODEL,
  OPENCODE_CONNECT_ERROR,
  type OpencodeClient,
  type SessionInfo,
  type ModelOption,
  type AgentOption,
  type CommandOption,
  type OutgoingFile,
} from '~/composables/useOpencode'
import { registerProjectSession } from '~/composables/useProjects'

// The project layout owns the shell + session list; the stable key keeps this
// page mounted across project switches so content swaps in place.
definePageMeta({ middleware: 'auth', layout: 'project', key: 'project-home' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const projectsStore = useProjectsStore()
const { projects } = storeToRefs(projectsStore)
const projectName = computed(() => projects.value.find((p) => p.id === projectId.value)?.name ?? 'Your project')
const sessionsStore = useSessionsStore()

const STARTERS = [
  { icon: Building2, label: 'Research a competitor' },
  { icon: Globe, label: 'Build a landing page' },
  { icon: Search, label: 'Audit this codebase' },
  { icon: Presentation, label: 'Draft a project brief' },
  { icon: Bug, label: 'Find and fix a bug' },
  { icon: TestTube2, label: 'Add tests for recent changes' },
  { icon: FileText, label: 'Write docs for this project' },
  { icon: ShieldCheck, label: 'Review security posture' },
  { icon: ListChecks, label: 'Plan the next milestone' },
]

let client: OpencodeClient | null = null
const input = ref('')
const creating = ref(false)
const error = ref<string | null>(null)

const models = ref<ModelOption[]>([])
const agents = ref<AgentOption[]>([])
const commands = ref<CommandOption[]>([])
const loadingSelectors = ref(true)
// Shared with the session page so the choice sticks across surfaces.
const { selectedModel, selectedAgent } = storeToRefs(useChatStore())

const promptModel = computed(() => {
  const [providerID, ...rest] = (selectedModel.value ?? '').split('/')
  return providerID && rest.length ? { providerID, modelID: rest.join('/') } : OPENCODE_MODEL
})

onMounted(async () => {
  void projectsStore.load()
  // Selector data is server-global and secondary — load once, tolerate failure.
  try {
    client = await createOpencodeClient()
    ;[models.value, agents.value, commands.value] = await Promise.all([
      fetchModels(client),
      fetchAgents(client),
      fetchCommands(client),
    ])
    if (!selectedModel.value && models.value.length > 0) {
      const fallback = `${OPENCODE_MODEL.providerID}/${OPENCODE_MODEL.modelID}`
      const exists = models.value.some((m) => `${m.providerID}/${m.modelID}` === fallback)
      const first = models.value[0]!
      selectedModel.value = exists ? fallback : `${first.providerID}/${first.modelID}`
    }
    if (!selectedAgent.value && agents.value.length > 0) {
      selectedAgent.value = agents.value[0]!.name
    }
  } catch {
    /* composer degrades to plain input */
  } finally {
    loadingSelectors.value = false
  }
})

/** Create a session, optionally fire the first prompt, then jump into it. */
async function startSession(text = '', files: OutgoingFile[] = []) {
  if (creating.value) return
  creating.value = true
  error.value = null
  try {
    if (!client) client = await createOpencodeClient()
    const res = await client.session.create({ body: { title: text.trim() || 'New session' } })
    const created = unwrap<SessionInfo>(res)
    await registerProjectSession(projectId.value, created.id)
    sessionsStore.add(created)
    const parts = [...filePartsFrom(files), ...(text.trim() ? [{ type: 'text', text: text.trim() }] : [])]
    if (parts.length > 0) {
      // Fire-and-forget so navigation isn't blocked, but surface failures —
      // otherwise the user lands in a session that silently never answers.
      client.session
        .prompt({
          path: { id: created.id },
          body: {
            model: promptModel.value,
            ...(selectedAgent.value ? { agent: selectedAgent.value } : {}),
            parts,
          },
        })
        .catch(() => toast.error('Failed to send the first message — try again in the session.'))
    }
    await navigateTo(`/projects/${projectId.value}/sessions/${created.id}`)
  } catch {
    error.value = OPENCODE_CONNECT_ERROR
    creating.value = false
  }
}

/** Slash command from the composer: open a session and run it there. */
async function startCommand(name: string, args: string) {
  if (creating.value) return
  creating.value = true
  error.value = null
  try {
    if (!client) client = await createOpencodeClient()
    const created = unwrap<SessionInfo>(await client.session.create({ body: { title: `/${name}` } }))
    await registerProjectSession(projectId.value, created.id)
    sessionsStore.add(created)
    client.session
      .command({
        path: { id: created.id },
        body: {
          command: name,
          arguments: args,
          model: `${promptModel.value.providerID}/${promptModel.value.modelID}`,
          ...(selectedAgent.value ? { agent: selectedAgent.value } : {}),
        },
      })
      .catch(() => toast.error('Failed to run the command — try again in the session.'))
    await navigateTo(`/projects/${projectId.value}/sessions/${created.id}`)
  } catch {
    error.value = OPENCODE_CONNECT_ERROR
    creating.value = false
  }
}

function applySuggestion(label: string) {
  input.value = label
}
</script>

<template>
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
          <ProjectHomeSections />
        </div>
      </div>
    </div>

    <!-- Bottom dock — starter chips over the shared composer -->
    <div class="relative z-10 shrink-0">
      <div class="mx-auto w-full max-w-[52rem] px-2 sm:px-4">
        <p v-if="error" class="mb-2 flex items-center gap-1.5 px-2 text-sm text-destructive">
          <AlertCircle class="size-3.5 shrink-0" />
          {{ error }}
        </p>

        <ScrollRow class="mb-3">
          <div class="flex items-center gap-2 px-1">
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
        </ScrollRow>
      </div>

      <SessionChatInput
        v-model="input"
        v-model:model="selectedModel"
        v-model:agent="selectedAgent"
        :busy="creating"
        wide
        :agents="agents"
        :models="models"
        :commands="commands"
        :context="null"
        :loading-selectors="loadingSelectors"
        placeholder="Describe a task to start a session…"
        autofocus
        @send="startSession"
        @command="startCommand"
      />
    </div>
  </div>
</template>
