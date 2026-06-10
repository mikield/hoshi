<script setup lang="ts">
import { Badge } from '@hoshi/ui'

// The one card shell every organization tab uses: header (title, count,
// description, right-aligned actions), an optional search row, and the body.
defineProps<{
  title: string
  description?: string
  count?: number | null
}>()
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-border/60 bg-card">
    <div class="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-4">
      <div class="leading-tight">
        <h2 class="flex items-center gap-2 text-base font-semibold text-foreground">
          {{ title }}
          <Badge v-if="typeof count === 'number' && count > 0" variant="secondary" class="tabular-nums">{{ count }}</Badge>
        </h2>
        <p v-if="description" class="mt-0.5 text-xs text-muted-foreground">{{ description }}</p>
      </div>
      <slot name="actions" />
    </div>
    <div v-if="$slots.search" class="border-b border-border/60 px-6 py-3">
      <slot name="search" />
    </div>
    <slot />
  </div>
</template>
