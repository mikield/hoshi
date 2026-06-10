<script setup lang="ts">
import { computed } from "vue"
import { cn } from "../lib/utils"

// Minimal ring gauge (context usage, quotas, …). Sized by the host via class;
// stroke colors come from theme tokens via currentColor + the track opacity.
interface Props {
  /** 0–1 fraction of the ring to fill. */
  value: number
  strokeWidth?: number
  class?: string
}
const props = withDefaults(defineProps<Props>(), { strokeWidth: 2 })

const RADIUS = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const clamped = computed(() => Math.min(1, Math.max(0, props.value)))
const dashOffset = computed(() => CIRCUMFERENCE * (1 - clamped.value))
</script>

<template>
  <svg
    viewBox="0 0 20 20"
    role="meter"
    :aria-valuenow="Math.round(clamped * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    :class="cn('size-5 -rotate-90', props.class)"
  >
    <circle cx="10" cy="10" :r="RADIUS" fill="none" stroke="currentColor" :stroke-width="strokeWidth" class="opacity-15" />
    <circle
      cx="10"
      cy="10"
      :r="RADIUS"
      fill="none"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      :stroke-dasharray="CIRCUMFERENCE"
      :stroke-dashoffset="dashOffset"
      class="transition-[stroke-dashoffset] duration-300 ease-out"
    />
  </svg>
</template>
