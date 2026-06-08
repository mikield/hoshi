<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><ul data-slot="list" :class="cn('divide-y divide-border/60', props.class)"><slot /></ul></template>
