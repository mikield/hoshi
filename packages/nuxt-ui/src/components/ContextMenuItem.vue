<script setup lang="ts">
import { ContextMenuItem as Primitive } from "reka-ui"
import { cn } from "../lib/utils"

interface Props {
  class?: string
  inset?: boolean
  variant?: "default" | "destructive"
}
const props = withDefaults(defineProps<Props>(), { variant: "default" })
</script>
<template>
  <Primitive
    data-slot="context-menu-item"
    :data-inset="inset"
    :data-variant="variant"
    :class="cn(
      `data-[variant=destructive]:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[variant=destructive]:data-[highlighted]:text-destructive`,
      props.class
    )"
  ><slot /></Primitive>
</template>
