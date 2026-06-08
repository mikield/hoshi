<script setup lang="ts">
import { CollapsibleTrigger as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive data-slot="collapsible-trigger" :class="cn('cursor-pointer', props.class)"><slot /></Primitive></template>
