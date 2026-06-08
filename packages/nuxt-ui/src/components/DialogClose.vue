<script setup lang="ts">
import { DialogClose as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="dialog-close" v-bind="$attrs"><slot /></Primitive></template>
