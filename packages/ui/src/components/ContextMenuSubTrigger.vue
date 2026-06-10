<script setup lang="ts">
import { ContextMenuSubTrigger as Primitive } from "reka-ui"
import { ChevronRightIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"

const props = defineProps<{ class?: string; inset?: boolean }>()
</script>
<template>
  <Primitive
    data-slot="context-menu-sub-trigger"
    :data-inset="inset ? '' : undefined"
    :class="cn(
      `data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground`,
      props.class
    )"
  >
    <slot />
    <ChevronRightIcon class="ml-auto" />
  </Primitive>
</template>
