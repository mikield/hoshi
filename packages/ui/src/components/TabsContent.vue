<script setup lang="ts">
import { TabsContent as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string; value: string }>()
</script>
<template><Primitive data-slot="tabs-content" :value="value" :class="cn('flex-1 outline-none', props.class)"><slot /></Primitive></template>
