<script setup lang="ts">
import { cn } from "../lib/utils"

interface Props {
  label?: string
  spacing?: "tight" | "default" | "loose"
  class?: string
}
const props = withDefaults(defineProps<Props>(), { spacing: "default" })

const SPACING = {
  tight: "mt-6",
  default: "mt-10",
  loose: "mt-14",
} as const
</script>
<template>
  <section :class="cn(SPACING[spacing], 'first:mt-0', props.class)">
    <div v-if="label || $slots.action" class="flex items-center justify-between mb-3">
      <h3 v-if="label" class="text-xs uppercase tracking-[0.08em] text-muted-foreground/60 font-semibold">{{ label }}</h3>
      <div v-if="$slots.action" class="shrink-0"><slot name="action" /></div>
    </div>
    <slot />
  </section>
</template>
