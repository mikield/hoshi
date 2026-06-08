<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaCorner } from "reka-ui"
import { cn } from "../lib/utils"
import ScrollBar from "./ScrollBar.vue"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <ScrollAreaRoot data-slot="scroll-area" :class="cn('relative', props.class)">
    <ScrollAreaViewport
      data-slot="scroll-area-viewport"
      class="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&>div]:!block"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollBar orientation="horizontal" />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
