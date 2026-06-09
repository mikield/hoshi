<script setup lang="ts">
import { PopoverAnchor as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="popover-anchor" v-bind="$attrs"><slot /></Primitive></template>
