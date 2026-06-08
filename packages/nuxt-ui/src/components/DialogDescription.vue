<script setup lang="ts">
import { DialogDescription as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive data-slot="dialog-description" :class="cn('text-muted-foreground text-sm', props.class)"><slot /></Primitive></template>
