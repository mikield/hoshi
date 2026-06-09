<script setup lang="ts">
import { AccordionItem as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string; value: string }>()
</script>
<template><Primitive data-slot="accordion-item" :value="value" :class="cn('border-b last:border-b-0', props.class)"><slot /></Primitive></template>
