<script setup lang="ts">
import { ContextMenuTrigger as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="context-menu-trigger" v-bind="$attrs"><slot /></Primitive></template>
