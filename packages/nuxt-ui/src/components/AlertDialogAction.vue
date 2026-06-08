<script setup lang="ts">
import { AlertDialogAction as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
import { buttonVariants } from "./button"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive :class="cn(buttonVariants(), props.class)"><slot /></Primitive></template>
