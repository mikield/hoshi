<script setup lang="ts">
import { DrawerDescription as Primitive } from "vaul-vue"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive data-slot="drawer-description" :class="cn('text-muted-foreground text-sm', props.class)"><slot /></Primitive></template>
