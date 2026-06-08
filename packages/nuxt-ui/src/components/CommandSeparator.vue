<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><div data-slot="command-separator" :class="cn('bg-border/40 mx-3 my-1 h-px', props.class)" /></template>
