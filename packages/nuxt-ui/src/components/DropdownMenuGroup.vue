<script setup lang="ts">
import { DropdownMenuGroup as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="dropdown-menu-group" v-bind="$attrs"><slot /></Primitive></template>
