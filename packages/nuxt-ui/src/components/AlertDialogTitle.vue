<script setup lang="ts">
import { AlertDialogTitle as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive data-slot="alert-dialog-title" :class="cn('text-lg font-semibold', props.class)"><slot /></Primitive></template>
