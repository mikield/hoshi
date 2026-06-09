<script setup lang="ts">
import { cn } from "../lib/utils"
import { STATUS_BG, STATUS_TEXT, type StatusTone } from "./status"

interface Props {
  tone?: StatusTone
  class?: string
}
const props = withDefaults(defineProps<Props>(), { tone: "neutral" })
</script>
<template>
  <span data-slot="status-badge" :class="cn('inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-2xl px-2 py-0.5 text-xs font-medium', STATUS_BG[tone], STATUS_TEXT[tone], props.class)">
    <slot />
  </span>
</template>
