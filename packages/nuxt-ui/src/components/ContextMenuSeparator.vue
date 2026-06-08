<script setup lang="ts">
import { ContextMenuSeparator as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive data-slot="context-menu-separator" :class="cn('bg-border -mx-1 my-1 h-px', props.class)" /></template>
