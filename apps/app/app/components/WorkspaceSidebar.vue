<script setup lang="ts">
import { computed } from 'vue'
import { Button, ScrollArea, EntityAvatar, cn } from '@hoshi/ui'
import { Plus, MessageSquare, ListTree, Loader2 } from 'lucide-vue-next'
import type { SessionInfo } from '~/composables/useOpencode'

const props = defineProps<{
  projectId: string
  sessions: SessionInfo[]
  activeSessionId: string | null
  loading: boolean
}>()

const emit = defineEmits<{ select: [id: string]; create: [] }>()

const projectLabel = computed(() => `Project ${props.projectId.slice(0, 6)}`)
</script>

<template>
  <div class="flex w-[260px] shrink-0 flex-col border-r border-border/60 bg-sidebar">
    <div class="flex items-center justify-between gap-2 px-3 py-3">
      <NuxtLink to="/projects" class="flex min-w-0 items-center gap-2 rounded-md transition-opacity hover:opacity-80">
        <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">K</span>
        <EntityAvatar :label="projectLabel" size="sm" />
        <span class="truncate text-sm font-medium text-foreground">{{ projectLabel }}</span>
      </NuxtLink>
    </div>
    <div class="flex items-center justify-between gap-2 px-3 pb-1.5 pt-1">
      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <ListTree class="size-3.5" />
        Sessions
      </span>
      <Button size="icon" variant="ghost" class="size-6" title="New session" @click="emit('create')">
        <Plus class="size-3.5" />
      </Button>
    </div>
    <ScrollArea class="flex-1">
      <div class="flex flex-col gap-0.5 p-2 pt-0">
        <div v-if="loading" class="flex items-center gap-2 px-2 py-3 text-xs text-muted-foreground">
          <Loader2 class="size-3.5 animate-spin" />
          Loading…
        </div>
        <div v-if="!loading && sessions.length === 0" class="px-2 py-3 text-xs text-muted-foreground">No sessions yet.</div>
        <button
          v-for="s in sessions"
          :key="s.id"
          type="button"
          :class="cn(
            'flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
            s.id === activeSessionId
              ? 'bg-primary/[0.05] border-l-2 border-l-primary text-foreground'
              : 'border-l-2 border-l-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
          )"
          @click="emit('select', s.id)"
        >
          <MessageSquare class="size-3.5 shrink-0 text-muted-foreground/60" />
          <span class="truncate">{{ s.title || s.id }}</span>
        </button>
      </div>
    </ScrollArea>
  </div>
</template>
