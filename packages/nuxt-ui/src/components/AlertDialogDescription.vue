<script setup lang="ts">
import { AlertDialogDescription as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive data-slot="alert-dialog-description" :class="cn('text-muted-foreground text-sm', props.class)"><slot /></Primitive></template>
