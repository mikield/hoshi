<script setup lang="ts">
import { DialogTrigger as Primitive } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><Primitive data-slot="dialog-trigger" v-bind="$attrs"><slot /></Primitive></template>
