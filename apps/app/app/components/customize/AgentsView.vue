<script setup lang="ts">
import { computed } from 'vue'
import { Badge, EntityAvatar, MarkdownContent } from '@hoshi/ui'
import { Bot } from 'lucide-vue-next'
import type { AgentOption } from '~/composables/useOpencode'

const props = defineProps<{ agents: AgentOption[] }>()

const items = computed(() =>
  props.agents.map((agent) => ({ id: agent.name, label: agent.name, sublabel: agent.description })),
)

function agentByName(name: string): AgentOption | undefined {
  return props.agents.find((agent) => agent.name === name)
}
</script>

<template>
  <CustomizeListDetailSection :icon="Bot" title="Agents" :items="items" search-placeholder="Search agents…">
    <template #row="{ item }">
      <EntityAvatar :label="item.label" size="xs" />
      <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ item.label }}</span>
    </template>
    <template #detail="{ item }">
      <div class="mx-auto w-full max-w-3xl px-6 py-8">
        <div class="flex items-start gap-4">
          <EntityAvatar :label="item.label" size="lg" />
          <div class="min-w-0 flex-1 leading-tight">
            <div class="flex items-center gap-2">
              <h2 class="truncate text-lg font-semibold tracking-tight text-foreground">{{ item.label }}</h2>
              <Badge variant="secondary">primary</Badge>
            </div>
            <p class="mt-1 text-sm text-muted-foreground">Selectable in the composer's agent picker.</p>
          </div>
        </div>
        <MarkdownContent v-if="agentByName(item.id)?.description" class="mt-6">
          <p>{{ agentByName(item.id)!.description }}</p>
        </MarkdownContent>
      </div>
    </template>
  </CustomizeListDetailSection>
</template>
