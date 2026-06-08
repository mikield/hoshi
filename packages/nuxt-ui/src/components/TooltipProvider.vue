<script setup lang="ts">
import { TooltipProvider as Primitive } from "reka-ui"
const props = withDefaults(defineProps<{ delayDuration?: number }>(), { delayDuration: 0 })
</script>
<template><Primitive data-slot="tooltip-provider" :delay-duration="delayDuration"><slot /></Primitive></template>
