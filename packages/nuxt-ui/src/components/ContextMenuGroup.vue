<script setup lang="ts">
import { ContextMenuGroup as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="context-menu-group" v-bind="$attrs"><slot /></Primitive></template>
