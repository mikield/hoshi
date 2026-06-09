<script setup lang="ts">
import { computed } from "vue"
import { DropdownMenuSubContent as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
import { floatingZ, useDialogDepth } from "../lib/z-stack"

const props = defineProps<{ class?: string }>()
const depth = useDialogDepth()
const z = computed(() => floatingZ(depth) + 1)
</script>
<template>
  <Primitive
    data-slot="dropdown-menu-sub-content"
    :style="{ zIndex: z }"
    :class="cn(
      `bg-card text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-hidden rounded-2xl border border-border/60 p-1`,
      props.class
    )"
  ><slot /></Primitive>
</template>
