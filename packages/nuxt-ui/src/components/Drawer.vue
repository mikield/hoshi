<script setup lang="ts">
import { DrawerRoot } from "vaul-vue"
defineOptions({ inheritAttrs: false })
</script>
<template><DrawerRoot data-slot="drawer" v-bind="$attrs"><slot /></DrawerRoot></template>
