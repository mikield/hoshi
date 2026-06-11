<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'
import { cn } from '@hoshi/ui'
import {
  Bot,
  Container,
  FolderOpen,
  GitPullRequest,
  KeyRound,
  MessageSquare,
  Plug,
  Settings,
  SlidersHorizontal,
  Sparkles,
  SquareSlash,
  Terminal,
  Timer,
  Users,
  Webhook,
  X,
} from 'lucide-vue-next'
import {
  createOpencodeClient,
  fetchAgents,
  fetchCommands,
  fetchSkills,
  fetchMcpServers,
  type AgentOption,
  type CommandOption,
  type SkillInfo,
  type McpServerInfo,
} from '~/composables/useOpencode'
import { useProjects } from '~/composables/useProjects'
import { useCustomize, type CustomizeSection } from '~/composables/useCustomize'

const { open, section } = useCustomize()
const route = useRoute()
const { projects } = storeToRefs(useProjectsStore())

const projectId = computed(() => (route.params.id as string | undefined) ?? null)
const projectName = computed(() => projects.value.find((p) => p.id === projectId.value)?.name ?? null)

interface RailItem {
  id: CustomizeSection
  label: string
  icon: Component
}

const NAV_GROUPS: { label: string; items: RailItem[] }[] = [
  {
    label: 'Build',
    items: [
      { id: 'agents', label: 'Agents', icon: Bot },
      { id: 'skills', label: 'Skills', icon: Sparkles },
      { id: 'commands', label: 'Commands', icon: SquareSlash },
    ],
  },
  {
    label: 'Connect',
    items: [
      { id: 'connectors', label: 'Connectors', icon: Plug },
      { id: 'secrets', label: 'Secrets', icon: KeyRound },
      { id: 'channels', label: 'Channels', icon: MessageSquare },
    ],
  },
  {
    label: 'Automate',
    items: [
      { id: 'schedules', label: 'Schedules', icon: Timer },
      { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    ],
  },
]

const FOOTER_ITEMS: RailItem[] = [
  { id: 'changes', label: 'Changes', icon: GitPullRequest },
  { id: 'files', label: 'Files', icon: FolderOpen },
  { id: 'sandbox', label: 'Sandbox', icon: Container },
  { id: 'dev', label: 'Dev', icon: Terminal },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

// ── Instance data (loaded once, on first open) ───────────────────────────────

const agents = ref<AgentOption[]>([])
const commands = ref<CommandOption[]>([])
const skills = ref<SkillInfo[]>([])
const mcpServers = ref<McpServerInfo[]>([])
let loadedOnce = false

watch(open, (isOpen) => {
  if (isOpen && !loadedOnce) void loadAll()
})

async function loadAll() {
  try {
    const client = await createOpencodeClient()
    ;[agents.value, commands.value, skills.value, mcpServers.value] = await Promise.all([
      fetchAgents(client),
      fetchCommands(client),
      fetchSkills(),
      fetchMcpServers(),
    ])
    loadedOnce = true
  } catch {
    /* sections render their own empty states */
  }
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    open.value = false
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-[0.99]"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0 scale-[0.99]"
  >
    <div v-if="open" class="fixed inset-0 z-40 flex h-dvh flex-col bg-background" role="dialog" aria-label="Customize instance">
      <!-- Header -->
      <header class="flex h-12 shrink-0 items-center justify-between border-b border-border/60 pl-4 pr-2">
        <div class="flex min-w-0 items-center gap-2">
          <SlidersHorizontal class="size-4 shrink-0 text-muted-foreground" />
          <span class="text-sm font-semibold text-foreground">Customize</span>
          <span v-if="projectName" class="truncate text-sm text-muted-foreground">· {{ projectName }}</span>
        </div>
        <button
          type="button"
          aria-label="Close customize"
          class="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          @click="open = false"
        >
          <X class="size-4" />
        </button>
      </header>

      <div class="flex min-h-0 flex-1 flex-col md:flex-row">
        <!-- Rail -->
        <nav class="flex w-[196px] shrink-0 flex-col border-r border-border/60 bg-muted/20">
          <div class="flex-1 overflow-y-auto px-2.5 py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            <div v-for="(group, i) in NAV_GROUPS" :key="group.label" :class="i > 0 && 'mt-4'">
              <div class="px-2 pb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">{{ group.label }}</div>
              <div class="space-y-0.5">
                <button
                  v-for="item in group.items"
                  :key="item.id"
                  type="button"
                  :class="cn(
                    'group relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium transition-colors',
                    section === item.id ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  )"
                  @click="section = item.id"
                >
                  <component :is="item.icon" :class="cn('h-3.5 w-3.5 shrink-0', section === item.id ? 'text-foreground' : 'text-muted-foreground/70')" />
                  <span class="truncate">{{ item.label }}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="border-t border-border/50 px-2.5 py-2.5">
            <div class="space-y-0.5">
              <button
                v-for="item in FOOTER_ITEMS"
                :key="item.id"
                type="button"
                :class="cn(
                  'group relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium transition-colors',
                  section === item.id ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )"
                @click="section = item.id"
              >
                <component :is="item.icon" :class="cn('h-3.5 w-3.5 shrink-0', section === item.id ? 'text-foreground' : 'text-muted-foreground/70')" />
                <span class="truncate">{{ item.label }}</span>
              </button>
            </div>
          </div>
        </nav>

        <!-- Section content -->
        <main class="min-h-0 min-w-0 flex-1 overflow-hidden bg-background">
          <CustomizeAgentsView v-if="section === 'agents'" :agents="agents" />
          <CustomizeSkillsView v-else-if="section === 'skills'" :skills="skills" />
          <CustomizeCommandsView v-else-if="section === 'commands'" :commands="commands" />
          <CustomizeConnectorsView v-else-if="section === 'connectors'" :servers="mcpServers" />
          <CustomizeSecretsView v-else-if="section === 'secrets'" />
          <CustomizeChannelsView v-else-if="section === 'channels'" />
          <CustomizeSchedulesView v-else-if="section === 'schedules'" />
          <CustomizeWebhooksView v-else-if="section === 'webhooks'" />
          <CustomizeChangesView v-else-if="section === 'changes'" />
          <CustomizeFilesView v-else-if="section === 'files'" />
          <CustomizeSandboxView v-else-if="section === 'sandbox'" />
          <CustomizeDevView v-else-if="section === 'dev'" />
          <CustomizeMembersView v-else-if="section === 'members'" />
          <CustomizeSettingsView v-else-if="section === 'settings' && projectId" :project-id="projectId" />
        </main>
      </div>
    </div>
  </Transition>
</template>
