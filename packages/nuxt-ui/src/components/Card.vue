<script setup lang="ts">
import { cn } from "../lib/utils"
import { cardVariants, type CardVariants } from "./card"

const props = defineProps<{ variant?: CardVariants["variant"]; class?: string }>()
</script>

<template>
  <div data-slot="card" :class="cn(cardVariants({ variant: props.variant }), props.class)">
    <slot />
  </div>
</template>
