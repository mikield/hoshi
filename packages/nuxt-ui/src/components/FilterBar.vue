<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <div data-slot="filter-bar" role="tablist" :class="cn('bg-foreground/[0.05] text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-full p-0.5 gap-0.5', props.class)"><slot /></div>
</template>
