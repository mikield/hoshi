<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <kbd data-slot="kbd-group" :class="cn('inline-flex items-center gap-1', props.class)"><slot /></kbd>
</template>
