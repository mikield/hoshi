<script setup lang="ts">
import { Primitive } from "reka-ui"
import { cn } from "../lib/utils"
const props = withDefaults(defineProps<{ class?: string; asChild?: boolean; as?: string | object }>(), { as: "a" })
</script>
<template>
  <Primitive data-slot="breadcrumb-link" :as="as" :as-child="asChild" :class="cn('cursor-pointer hover:text-foreground transition-colors', props.class)"><slot /></Primitive>
</template>
