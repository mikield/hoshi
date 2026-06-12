<script setup lang="ts">
import { CornerLeftUp, GitBranch } from 'lucide-vue-next'
import type { SessionInfo } from '~/composables/useOpencode'

defineProps<{
  /** The session this one was spawned from, when it is a sub-session. */
  parent: SessionInfo | null
  /** Sub-sessions spawned from this one (task tool, forks with parentID). */
  children: SessionInfo[]
}>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <div class="flex items-center gap-1.5 overflow-x-auto px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
    <button
      v-if="parent"
      type="button"
      class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
      @click="emit('select', parent.id)"
    >
      <CornerLeftUp class="size-3" />
      <span class="max-w-48 truncate">{{ parent.title || 'Parent session' }}</span>
    </button>
    <button
      v-for="child in children"
      :key="child.id"
      type="button"
      class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
      @click="emit('select', child.id)"
    >
      <GitBranch class="size-3" />
      <span class="max-w-48 truncate">{{ child.title || 'Sub-session' }}</span>
    </button>
  </div>
</template>
