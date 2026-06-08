<script setup lang="ts">
import { SelectSeparator as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive data-slot="select-separator" :class="cn('bg-border pointer-events-none -mx-1 my-1 h-px', props.class)" /></template>
