<script setup lang="ts">
import { CollapsibleRoot } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><CollapsibleRoot data-slot="collapsible" v-bind="$attrs"><slot /></CollapsibleRoot></template>
