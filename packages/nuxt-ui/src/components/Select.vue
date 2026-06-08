<script setup lang="ts">
import { SelectRoot } from "reka-ui"
defineOptions({ inheritAttrs: false })
</script>
<template>
  <SelectRoot data-slot="select" v-bind="$attrs">
    <slot />
  </SelectRoot>
</template>
