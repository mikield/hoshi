<script setup lang="ts">
import { cn } from "../lib/utils"
import { tagVariants, type TagVariants } from "./tag"

const props = defineProps<{ variant?: TagVariants["variant"]; class?: string }>()
</script>
<template>
  <span data-slot="tag" :class="cn(tagVariants({ variant: props.variant }), props.class)"><slot /></span>
</template>
