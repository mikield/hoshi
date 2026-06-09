<script setup lang="ts">
import { SelectValue as Primitive } from "reka-ui"
const props = defineProps<{ placeholder?: string }>()
</script>
<template><Primitive data-slot="select-value" :placeholder="placeholder" /></template>
