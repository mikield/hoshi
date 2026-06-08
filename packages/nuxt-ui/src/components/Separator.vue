<script setup lang="ts">
import { Separator as SeparatorPrimitive } from "reka-ui"
import { cn } from "../lib/utils"

interface Props {
  class?: string
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  orientation: "horizontal",
  decorative: true,
})
</script>

<template>
  <SeparatorPrimitive
    data-slot="separator"
    :decorative="decorative"
    :orientation="orientation"
    :class="cn(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      props.class
    )"
  />
</template>
