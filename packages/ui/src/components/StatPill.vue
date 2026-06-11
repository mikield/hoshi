<script setup lang="ts">
import { computed } from "vue"
import { cn } from "../lib/utils"

export type StatTone = "default" | "success" | "warning" | "danger"

const props = defineProps<{
  label: string
  value: string | number
  hint?: string
  tone?: StatTone
  class?: string
}>()

const TONE_TEXT: Record<StatTone, string> = {
  default: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
}

const toneClass = computed(() => TONE_TEXT[props.tone ?? "default"])
</script>

<template>
  <div :class="cn('min-w-0 rounded-2xl border border-border/60 bg-card p-4', props.class)">
    <div class="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">{{ label }}</div>
    <div :class="cn('mt-1 truncate text-2xl font-semibold tracking-tight', toneClass)">{{ value }}</div>
    <div v-if="hint" class="mt-0.5 truncate text-xs text-muted-foreground">{{ hint }}</div>
  </div>
</template>
