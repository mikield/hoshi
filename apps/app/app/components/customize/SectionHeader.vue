<script setup lang="ts">
import type { Component } from 'vue'
import { Badge, cn } from '@hoshi/ui'

// The one header bar every Customize section uses — a slim h-12 row with a
// leading icon + title, an optional count badge, and an actions slot pinned
// right. One shared header is what makes a dozen sections read as one product.
const props = defineProps<{
  icon: Component
  title: string
  count?: number | null
  class?: string
}>()
</script>

<template>
  <div :class="cn('flex h-12 shrink-0 items-center gap-2 border-b border-border/60 px-4', props.class)">
    <component :is="icon" class="h-4 w-4 shrink-0 text-muted-foreground" />
    <h1 class="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{{ title }}</h1>
    <Badge v-if="typeof count === 'number' && count > 0" variant="secondary" class="tabular-nums">{{ count }}</Badge>
    <slot name="actions" />
  </div>
</template>
