<script setup lang="ts">
import { DrawerTitle as Primitive } from "vaul-vue"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive data-slot="drawer-title" :class="cn('text-foreground font-semibold', props.class)"><slot /></Primitive></template>
