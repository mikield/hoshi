<script setup lang="ts">
import { cn } from '@hoshi/ui'
import { X } from 'lucide-vue-next'
import type { ChatMessage } from '~/composables/useOpencode'

export type PanelView = 'actions' | 'browser' | 'files'

defineProps<{ view: PanelView; messages: ChatMessage[] }>()
const emit = defineEmits<{ 'change-view': [view: PanelView]; close: [] }>()

const PANEL_TABS: { id: PanelView; label: string }[] = [
  { id: 'actions', label: 'Actions' },
  { id: 'browser', label: 'Browser' },
  { id: 'files', label: 'Files' },
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
      <WorkspaceActionsPanel v-if="view === 'actions'" :messages="messages" />
      <WorkspaceBrowserPanel v-else-if="view === 'browser'" />
      <WorkspaceFilesPanel v-else-if="view === 'files'" />
    </div>
  </div>
</template>
