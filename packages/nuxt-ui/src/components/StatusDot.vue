<script setup lang="ts">
import { cn } from "../lib/utils"
import { STATUS_DOT, type StatusTone } from "./status"

interface Props {
  tone?: StatusTone
  pulse?: boolean
  class?: string
}
const props = withDefaults(defineProps<Props>(), { tone: "neutral", pulse: false })
</script>
<template>
  <span data-slot="status-dot" :class="cn('inline-block size-1.5 shrink-0 rounded-full', STATUS_DOT[tone], pulse && 'animate-pulse', props.class)" />
</template>
