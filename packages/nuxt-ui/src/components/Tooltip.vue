<script setup lang="ts">
import { TooltipRoot } from "reka-ui"
import TooltipProvider from "./TooltipProvider.vue"
defineOptions({ inheritAttrs: false })
</script>
<template>
  <TooltipProvider>
    <TooltipRoot data-slot="tooltip" v-bind="$attrs"><slot /></TooltipRoot>
  </TooltipProvider>
</template>
