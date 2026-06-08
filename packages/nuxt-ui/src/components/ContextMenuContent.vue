<script setup lang="ts">
import { ContextMenuContent as Primitive, ContextMenuPortal } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <ContextMenuPortal>
    <Primitive
      data-slot="context-menu-content"
      :class="cn(
        `bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--reka-context-menu-content-available-height) min-w-[8rem] origin-(--reka-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl border border-border/60 p-1`,
        props.class
      )"
    ><slot /></Primitive>
  </ContextMenuPortal>
</template>
