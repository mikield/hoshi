<script setup lang="ts">
import { DropdownMenuRadioGroup as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="dropdown-menu-radio-group" v-bind="$attrs"><slot /></Primitive></template>
