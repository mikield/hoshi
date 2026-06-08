<script setup lang="ts">
import { DrawerClose as Primitive } from "vaul-vue"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="drawer-close" v-bind="$attrs"><slot /></Primitive></template>
