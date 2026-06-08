<script setup lang="ts">
import { AccordionHeader, AccordionTrigger as Primitive } from "reka-ui"
import { ChevronDownIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <AccordionHeader class="flex">
    <Primitive
      data-slot="accordion-trigger"
      :class="cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-2xl py-4 text-left text-sm font-medium transition-colors outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
        props.class
      )"
    >
      <slot />
      <ChevronDownIcon class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
    </Primitive>
  </AccordionHeader>
</template>
