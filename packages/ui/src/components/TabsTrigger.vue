<script setup lang="ts">
import { TabsTrigger as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string; value: string }>()
</script>
<template>
  <Primitive
    data-slot="tabs-trigger"
    :value="value"
    :class="cn(
      `cursor-pointer inline-flex h-[calc(100%-2px)] flex-1 items-center justify-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 text-muted-foreground/60 hover:text-foreground/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-foreground/[0.06] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
      props.class
    )"
  ><slot /></Primitive>
</template>
