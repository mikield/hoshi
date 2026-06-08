<script setup lang="ts">
import { DropdownMenuSubTrigger as Primitive } from "reka-ui"
import { ChevronRightIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"

const props = defineProps<{ class?: string; inset?: boolean }>()
</script>
<template>
  <Primitive
    data-slot="dropdown-menu-sub-trigger"
    :data-inset="inset"
    :class="cn(
      'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
      props.class
    )"
  >
    <slot />
    <ChevronRightIcon class="ml-auto size-4" />
  </Primitive>
</template>
