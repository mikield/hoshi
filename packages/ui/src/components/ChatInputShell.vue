<script setup lang="ts">
import { cn } from "../lib/utils"

interface Props {
  active?: boolean
  class?: string
}
const props = defineProps<Props>()
</script>
<template>
  <div :class="cn('w-full bg-card border border-border rounded-[24px] overflow-visible relative transition-colors', active && 'border-primary', props.class)">
    <div class="relative flex flex-col w-full gap-2 overflow-visible">
      <slot />
    </div>
  </div>
</template>
