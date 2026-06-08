<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string; heading?: string }>()
</script>
<template>
  <div
    data-slot="command-group"
    :class="cn(
      'text-foreground overflow-hidden py-1.5',
      '[&_[data-command-group-heading]]:px-3 [&_[data-command-group-heading]]:pt-3 [&_[data-command-group-heading]]:pb-1.5 [&_[data-command-group-heading]]:text-xs [&_[data-command-group-heading]]:font-semibold [&_[data-command-group-heading]]:uppercase [&_[data-command-group-heading]]:tracking-[0.1em] [&_[data-command-group-heading]]:text-muted-foreground/50',
      props.class
    )"
  >
    <div v-if="$slots.heading || heading" data-command-group-heading><slot name="heading">{{ heading }}</slot></div>
    <slot />
  </div>
</template>

<style>
/* Hide the group when every command-item inside it is hidden (v-show sets display:none) */
[data-slot="command-group"]:not(:has([data-slot="command-item"]:not([style*="display: none"]))) {
  display: none;
}
</style>
