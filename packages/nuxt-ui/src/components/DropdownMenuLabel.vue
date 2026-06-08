<script setup lang="ts">
import { DropdownMenuLabel as Primitive } from "reka-ui"
import { cn } from "../lib/utils"

const props = defineProps<{ class?: string; inset?: boolean }>()
</script>
<template>
  <Primitive
    data-slot="dropdown-menu-label"
    :data-inset="inset"
    :class="cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', props.class)"
  ><slot /></Primitive>
</template>
