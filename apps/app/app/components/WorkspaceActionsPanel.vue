<script setup lang="ts">
import { computed, type Component } from 'vue'
import { ToolCallCard, EmptyState } from '@hoshi/ui'
import {
  Hammer,
  Search,
  FileText,
  Edit3,
  FilePlus2,
  Terminal,
  Globe,
  FolderSearch,
  Bot,
  Wrench,
} from 'lucide-vue-next'
import type { ChatMessage, Part, ToolState } from '~/composables/useOpencode'

const props = defineProps<{ messages: ChatMessage[] }>()

const TOOL_ICONS: Record<string, Component> = {
  grep: Search,
  glob: FolderSearch,
  read: FileText,
  edit: Edit3,
  write: FilePlus2,
  bash: Terminal,
  webfetch: Globe,
  task: Bot,
}

type ActionItem = {
  key: string
  tool: string
  icon: Component
  subtitle: string
  status: 'running' | 'completed' | 'error'
  output: string
}

function subtitleFor(state: ToolState | undefined): string {
  if (state?.title) return state.title
  const input = state?.input ?? {}
  const hint = input.filePath ?? input.path ?? input.pattern ?? input.command ?? input.url ?? input.description
  return typeof hint === 'string' ? hint : ''
}

const actions = computed<ActionItem[]>(() =>
  props.messages.flatMap((message) =>
    message.parts
      .filter((part): part is Part & { tool: string } => part.type === 'tool' && !!part.tool)
      .map((part, index) => ({
        key: part.id ?? `${message.info.id}:${index}`,
        tool: part.tool,
        icon: TOOL_ICONS[part.tool] ?? Wrench,
        subtitle: subtitleFor(part.state),
        status:
          part.state?.status === 'error'
            ? ('error' as const)
            : part.state?.status === 'completed'
              ? ('completed' as const)
              : ('running' as const),
        output: part.state?.output ?? '',
      })),
  ),
)
</script>

<template>
  <div class="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
    <div v-if="actions.length > 0" class="flex flex-col gap-0.5 p-4">
      <template v-for="action in actions" :key="action.key">
        <!-- The card only collapses when a default slot exists, so branch on output. -->
        <ToolCallCard v-if="action.output" :title="action.tool" :subtitle="action.subtitle" :status="action.status">
          <template #icon><component :is="action.icon" /></template>
          {{ action.output }}
        </ToolCallCard>
        <ToolCallCard v-else :title="action.tool" :subtitle="action.subtitle" :status="action.status">
          <template #icon><component :is="action.icon" /></template>
        </ToolCallCard>
      </template>
    </div>
    <EmptyState v-else :icon="Hammer" title="No actions yet" size="sm" class="h-full">
      <template #description>Tool calls show up here live while the agent works.</template>
    </EmptyState>
  </div>
</template>
