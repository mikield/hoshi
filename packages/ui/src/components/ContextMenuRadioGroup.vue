<script setup lang="ts">
import { ContextMenuRadioGroup as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="context-menu-radio-group" v-bind="$attrs"><slot /></Primitive></template>
