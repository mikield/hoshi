<script setup lang="ts">
import { Layers } from "lucide-vue-next"
import { cn } from "../lib/utils"

// Marks a context-compaction point in a chat thread: hairlines around a
// centered chip, so the "history was summarized here" boundary is unmissable.
const props = defineProps<{ label?: string; class?: string }>()
</script>

<template>
  <div :class="cn('my-3 flex items-center gap-3 py-4', props.class)">
    <div class="h-px flex-1 bg-border" />
    <div class="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/80 px-3 py-1.5">
      <Layers class="size-3.5 text-muted-foreground" />
      <span class="text-xs font-semibold tracking-wide text-muted-foreground">{{ label ?? 'Compaction' }}</span>
    </div>
    <div class="h-px flex-1 bg-border" />
  </div>
</template>
