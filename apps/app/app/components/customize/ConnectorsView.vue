<script setup lang="ts">
import { Badge, EntityAvatar, EmptyState, cn } from '@hoshi/ui'
import { Plug } from 'lucide-vue-next'
import type { McpServerInfo } from '~/composables/useOpencode'

defineProps<{ servers: McpServerInfo[] }>()
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="Plug" title="Connectors" :count="servers.length" />
    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <EmptyState v-if="servers.length === 0" :icon="Plug" title="No connectors yet" class="h-full">
        <template #description>MCP servers configured on the OpenCode instance show up here.</template>
      </EmptyState>
      <div v-else class="mx-auto w-full max-w-3xl space-y-2 px-4 py-8">
        <div
          v-for="server in servers"
          :key="server.name"
          class="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3"
        >
          <EntityAvatar :label="server.name" :icon="Plug" size="sm" />
          <span class="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{{ server.name }}</span>
          <span
            :class="cn('size-2 shrink-0 rounded-full', server.status === 'connected' ? 'bg-emerald-500' : 'bg-destructive')"
          />
          <Badge variant="secondary" class="capitalize">{{ server.status }}</Badge>
        </div>
      </div>
    </div>
  </div>
</template>
