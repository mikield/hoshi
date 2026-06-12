<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { CornerLeftUp, GitBranch } from 'lucide-vue-next'
import type { SessionInfo } from '~/composables/useOpencode'

const props = defineProps<{
  /** The session this one was spawned from, when it is a sub-session. */
  parent: SessionInfo | null
  /** Sub-sessions spawned from this one (task tool, forks with parentID). */
  children: SessionInfo[]
}>()

const emit = defineEmits<{ select: [id: string] }>()

/** One chip list — the parent leads, children follow. */
const chips = computed<{ id: string; icon: Component; label: string }[]>(() => [
  ...(props.parent ? [{ id: props.parent.id, icon: CornerLeftUp, label: props.parent.title || 'Parent session' }] : []),
  ...props.children.map((child) => ({ id: child.id, icon: GitBranch, label: child.title || 'Sub-session' })),
])
</script>

<template>
  <div class="flex items-center gap-1.5 overflow-x-auto px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
    <button
      v-for="chip in chips"
      :key="chip.id"
      type="button"
      class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
      @click="emit('select', chip.id)"
    >
      <component :is="chip.icon" class="size-3" />
      <span class="max-w-48 truncate">{{ chip.label }}</span>
    </button>
  </div>
</template>
