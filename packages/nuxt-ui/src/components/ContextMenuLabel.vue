<script setup lang="ts">
import { ContextMenuLabel as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string; inset?: boolean }>()
</script>
<template>
  <Primitive data-slot="context-menu-label" :data-inset="inset" :class="cn('text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', props.class)"><slot /></Primitive>
</template>
