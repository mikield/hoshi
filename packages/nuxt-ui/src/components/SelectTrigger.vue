<script setup lang="ts">
import { SelectTrigger as Primitive, SelectIcon } from "reka-ui"
import { ChevronDownIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"

interface Props {
  class?: string
  size?: "sm" | "default" | "lg"
}
const props = withDefaults(defineProps<Props>(), { size: "default" })
</script>

<template>
  <Primitive
    data-slot="select-trigger"
    :data-size="size"
    :class="cn(
      `cursor-pointer data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex w-fit items-center justify-between gap-2 rounded-2xl border bg-card px-3 py-2 text-sm font-medium whitespace-nowrap transition-[color] outline-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=lg]:h-11 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
      props.class
    )"
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDownIcon class="size-4 opacity-50" />
    </SelectIcon>
  </Primitive>
</template>
