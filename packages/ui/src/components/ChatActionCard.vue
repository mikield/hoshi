<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <div class="flex flex-col items-end gap-1">
    <div :class="cn('inline-flex flex-col gap-1.5 px-4 py-2.5 rounded-2xl border border-border/60 bg-muted/40 max-w-[85%]', props.class)">
      <slot />
    </div>
  </div>
</template>
