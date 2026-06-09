<script setup lang="ts">
import { SelectLabel as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <Primitive data-slot="select-label" :class="cn('text-muted-foreground px-2 py-1.5 text-xs', props.class)"><slot /></Primitive>
</template>
