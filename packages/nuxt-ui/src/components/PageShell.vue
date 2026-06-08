<script setup lang="ts">
import { cn } from "../lib/utils"

type Width = "reading" | "default" | "wide" | "full"

const WIDTH_CLASS: Record<Width, string> = {
  reading: "max-w-[720px]",
  default: "max-w-7xl",
  wide: "max-w-[1400px]",
  full: "max-w-none",
}

interface Props {
  width?: Width
  flush?: boolean
  class?: string
}
const props = withDefaults(defineProps<Props>(), { width: "default" })
</script>
<template>
  <div class="flex-1 overflow-y-auto bg-background">
    <div :class="cn('container mx-auto px-3 sm:px-4', WIDTH_CLASS[width], !flush && 'py-6 sm:py-8', props.class)">
      <slot />
    </div>
  </div>
</template>
