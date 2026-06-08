<script setup lang="ts">
import { ContextMenuRoot } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template><ContextMenuRoot data-slot="context-menu" v-bind="$attrs"><slot /></ContextMenuRoot></template>
