<script setup lang="ts">
import { DialogTitle as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive data-slot="dialog-title" :class="cn('text-lg leading-none font-semibold', props.class)"><slot /></Primitive></template>
