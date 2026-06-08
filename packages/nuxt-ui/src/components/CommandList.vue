<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <div data-slot="command-list" :class="cn('max-h-[min(60vh,480px)] scroll-py-2 overflow-x-hidden overflow-y-auto scrollbar-minimal py-1', props.class)">
    <slot />
  </div>
</template>
