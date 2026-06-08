<script setup lang="ts">
import { AccordionRoot } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><AccordionRoot data-slot="accordion" v-bind="$attrs"><slot /></AccordionRoot></template>
