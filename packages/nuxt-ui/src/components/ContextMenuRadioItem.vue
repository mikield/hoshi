<script setup lang="ts">
import { ContextMenuRadioItem as Primitive, ContextMenuItemIndicator } from "reka-ui"
import { CircleIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"

const props = defineProps<{ class?: string; value: string }>()
</script>
<template>
  <Primitive
    data-slot="context-menu-radio-item"
    :value="value"
    :class="cn(
      `relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground`,
      props.class
    )"
  >
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenuItemIndicator>
        <CircleIcon class="size-2 fill-current" />
      </ContextMenuItemIndicator>
    </span>
    <slot />
  </Primitive>
</template>
