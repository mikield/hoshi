<script setup lang="ts">
import { PopoverTrigger as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="popover-trigger" v-bind="$attrs"><slot /></Primitive></template>
