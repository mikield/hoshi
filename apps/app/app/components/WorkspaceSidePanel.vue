<script setup lang="ts">
import { ToolCallCard, cn } from '@hoshi/ui'
import { Globe, X, Search, FileText, Edit3 } from 'lucide-vue-next'

export type PanelView = 'actions' | 'browser' | 'files' | 'terminal'

defineProps<{ view: PanelView }>()
const emit = defineEmits<{ 'change-view': [view: PanelView]; close: [] }>()

const PANEL_TABS: { id: PanelView; label: string }[] = [
  { id: 'actions', label: 'Actions' },
  { id: 'browser', label: 'Browser' },
  { id: 'files', label: 'Files' },
  { id: 'terminal', label: 'Terminal' },
]

const MOCK_TOOL_CALLS = [
  { icon: Search, title: 'Grep', subtitle: 'pattern: useChatSendStore', status: 'completed' as const, body: '3 matches across 2 files' },
  { icon: FileText, title: 'Read', subtitle: 'src/lib/retry.ts', status: 'completed' as const, body: '32 lines' },
  { icon: Edit3, title: 'Edit', subtitle: 'src/lib/retry.ts · +6 −2', status: 'running' as const, body: '+ retry attempts default to 3\n+ exponential backoff on 5xx' },
]

const TERMINAL_LINES = [
  { text: '$ pnpm dev', tone: 'text-zinc-100' },
  { text: '▲ Next.js 15.5.14', tone: 'text-zinc-400' },
  { text: '- Local: http://localhost:3000', tone: 'text-zinc-400' },
  { text: '✓ Ready in 842ms', tone: 'text-emerald-400' },
  { text: '$ ', tone: 'text-zinc-100' },
]
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div class="flex h-10 shrink-0 items-center justify-between border-b border-border/60 pl-4 pr-2">
      <div role="tablist" aria-label="Side panel view" class="flex items-center gap-5">
        <button
          v-for="tab in PANEL_TABS"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="view === tab.id"
          :class="cn(
            'relative inline-flex h-10 cursor-pointer items-center text-xs tracking-tight transition-colors',
            view === tab.id ? 'font-medium text-foreground' : 'text-muted-foreground/70 hover:text-foreground/90',
          )"
          @click="emit('change-view', tab.id)"
        >
          {{ tab.label }}
          <span v-if="view === tab.id" aria-hidden class="absolute -bottom-px left-0 right-0 h-px bg-foreground" />
        </button>
      </div>
      <button
        type="button"
        class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
        title="Close panel (⌘I)"
        @click="emit('close')"
      >
        <X class="h-3.5 w-3.5" />
      </button>
    </div>
    <div class="min-h-0 flex-1 overflow-hidden">
      <!-- Actions -->
      <div v-if="view === 'actions'" class="flex flex-col gap-1 p-4">
        <ToolCallCard
          v-for="(call, i) in MOCK_TOOL_CALLS"
          :key="i"
          :title="call.title"
          :subtitle="call.subtitle"
          :status="call.status"
        >
          <template #icon><component :is="call.icon" /></template>
          {{ call.body }}
        </ToolCallCard>
      </div>

      <!-- Browser -->
      <div v-else-if="view === 'browser'" class="flex h-full flex-col">
        <div class="flex h-9 items-center gap-2 border-b border-border/50 px-3">
          <div class="flex flex-1 items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Globe class="size-3" />
            localhost:3000
          </div>
        </div>
        <div class="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          <span class="inline-flex items-center gap-2"><Globe class="size-4" />Live preview mock</span>
        </div>
      </div>

      <!-- Files -->
      <WorkspaceFilesPanel v-else-if="view === 'files'" />

      <!-- Terminal -->
      <div v-else-if="view === 'terminal'" class="h-full overflow-y-auto bg-[#0f0f14] px-4 py-3 font-mono text-xs leading-[1.7]">
        <div v-for="(l, i) in TERMINAL_LINES" :key="i" :class="cn('whitespace-pre', l.tone)">{{ l.text || ' ' }}</div>
        <span class="inline-block h-[14px] w-[7px] animate-pulse bg-zinc-100/80" />
      </div>
    </div>
  </div>
</template>
