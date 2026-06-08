<script setup lang="ts">
import { DropdownMenuSeparator as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template><Primitive data-slot="dropdown-menu-separator" :class="cn('bg-border -mx-1 my-1 h-px', props.class)" /></template>
