<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <div data-slot="command-footer" :class="cn('flex items-center gap-4 border-t border-border/50 bg-foreground/[0.015] px-4 py-2.5 text-xs text-muted-foreground/55', props.class)">
    <slot />
  </div>
</template>
