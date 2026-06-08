<script setup lang="ts">
import { cn } from "../lib/utils"
import PopoverContent from "./PopoverContent.vue"
import Command from "./Command.vue"

interface Props {
  class?: string
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
  shouldFilter?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  side: "top",
  align: "start",
  sideOffset: 8,
  shouldFilter: false,
})

const CMDK_SHARED_CLASSES = "[&_[data-command-group]]:px-1.5 [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0"
</script>
<template>
  <PopoverContent
    :side="side"
    :align="align"
    :side-offset="sideOffset"
    :class="cn(
      `w-[300px] p-0 overflow-hidden rounded-2xl
      relative bg-card text-popover-foreground
      border border-border/60
      before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent
      data-[state=open]:duration-[180ms] data-[state=closed]:duration-[140ms]
      data-[state=open]:zoom-in-[0.97] data-[state=closed]:zoom-out-[0.97]
      [&_[data-slot=command-input-wrapper]]:h-9 [&_[data-slot=command-input-wrapper]]:px-3 [&_[data-slot=command-input-wrapper]]:gap-2
      [&_[data-slot=command-input]]:h-9 [&_[data-slot=command-input]]:text-sm
      [&_[data-slot=command-list]]:py-0
      [&_[data-slot=command-group]]:py-1
      [&_[data-command-group-heading]]:!pt-2 [&_[data-command-group-heading]]:!pb-1 [&_[data-command-group-heading]]:!px-2 [&_[data-command-group-heading]]:!text-xs [&_[data-command-group-heading]]:!tracking-[0.12em]`,
      props.class
    )"
  >
    <Command :should-filter="shouldFilter" :class="CMDK_SHARED_CLASSES">
      <slot />
    </Command>
  </PopoverContent>
</template>
