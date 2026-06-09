<script setup lang="ts">
import { TooltipTrigger as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="tooltip-trigger" v-bind="$attrs"><slot /></Primitive></template>
