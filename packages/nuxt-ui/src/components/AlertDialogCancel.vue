<script setup lang="ts">
import { AlertDialogCancel as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
import { buttonVariants } from "./button"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive :class="cn(buttonVariants({ variant: 'outline' }), props.class)"><slot /></Primitive></template>
