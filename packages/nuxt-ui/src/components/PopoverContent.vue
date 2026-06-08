<script setup lang="ts">
import { computed } from "vue"
import { PopoverContent as Primitive, PopoverPortal } from "reka-ui"
import { cn } from "../lib/utils"
import { floatingZ, useDialogDepth } from "../lib/z-stack"

interface Props {
  class?: string
  align?: "start" | "center" | "end"
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
}
const props = withDefaults(defineProps<Props>(), { align: "center", sideOffset: 4 })
const depth = useDialogDepth()
const z = computed(() => floatingZ(depth))
</script>
<template>
  <PopoverPortal>
    <Primitive
      data-slot="popover-content"
      :align="align"
      :side="side"
      :side-offset="sideOffset"
      :style="{ zIndex: z }"
      :class="cn(
        `bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-72 origin-(--reka-popover-content-transform-origin) rounded-2xl border border-border/60 p-4 outline-hidden`,
        props.class
      )"
    >
      <slot />
    </Primitive>
  </PopoverPortal>
</template>
