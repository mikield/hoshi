<script setup lang="ts">
import { DrawerTrigger as Primitive } from "vaul-vue"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="drawer-trigger" v-bind="$attrs"><slot /></Primitive></template>
