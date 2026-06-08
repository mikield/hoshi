<script setup lang="ts">
import { DropdownMenuSub as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="dropdown-menu-sub" v-bind="$attrs"><slot /></Primitive></template>
