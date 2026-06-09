<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <div class="flex flex-col items-end gap-1">
    <div :class="cn('flex flex-col max-w-[90%] rounded-3xl rounded-br-lg bg-card border border-border overflow-hidden px-4 py-2.5', props.class)">
      <slot />
    </div>
  </div>
</template>
