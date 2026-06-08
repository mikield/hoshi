<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <div :class="cn('flex items-center gap-2 -my-1', props.class)">
    <div class="flex-1 h-px bg-border/30" />
    <span v-if="$slots.default" class="text-xs text-muted-foreground/30 select-none whitespace-nowrap"><slot /></span>
    <div class="flex-1 h-px bg-border/30" />
  </div>
</template>
