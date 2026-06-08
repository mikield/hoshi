<script setup lang="ts">
import { CollapsibleContent as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <Primitive data-slot="collapsible-content" :class="cn('overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up', props.class)"><slot /></Primitive>
</template>
