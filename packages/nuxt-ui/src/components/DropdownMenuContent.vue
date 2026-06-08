<script setup lang="ts">
import { computed } from "vue"
import { DropdownMenuContent as Primitive, DropdownMenuPortal } from "reka-ui"
import { cn } from "../lib/utils"
import { floatingZ, useDialogDepth } from "../lib/z-stack"

const props = withDefaults(defineProps<{ class?: string; align?: "start" | "center" | "end"; side?: "top" | "bottom" | "left" | "right"; sideOffset?: number }>(), { align: "center", sideOffset: 4 })
const depth = useDialogDepth()
const z = computed(() => floatingZ(depth))
</script>
<template>
  <DropdownMenuPortal>
    <Primitive
      data-slot="dropdown-menu-content"
      :align="align"
      :side="side"
      :side-offset="sideOffset"
      :style="{ zIndex: z }"
      :class="cn(
        'relative bg-card text-popover-foreground',
        'border border-border/60',
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.97] data-[state=open]:zoom-in-[0.97] data-[state=open]:duration-[180ms] data-[state=closed]:duration-[140ms]',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        'max-h-(--reka-dropdown-menu-content-available-height) min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl p-1',
        props.class
      )"
    >
      <slot />
    </Primitive>
  </DropdownMenuPortal>
</template>
