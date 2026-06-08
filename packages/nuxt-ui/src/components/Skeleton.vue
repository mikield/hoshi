<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>

<template>
  <div
    :class="cn(
      'relative overflow-hidden rounded-2xl',
      'bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10',
      'skeleton-animate',
      props.class
    )"
  >
    <div class="skeleton-shimmer-wrapper">
      <div class="skeleton-shimmer-bar" />
    </div>
  </div>
</template>
