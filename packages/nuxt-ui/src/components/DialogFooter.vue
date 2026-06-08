<script setup lang="ts">
import { cn } from "../lib/utils"
const props = withDefaults(defineProps<{ class?: string; variant?: "default" | "bar" }>(), { variant: "default" })
</script>
<template>
  <div
    data-slot="dialog-footer"
    :class="cn(
      variant === 'bar'
        ? 'flex items-center justify-end gap-2 border-t border-border/60 bg-muted/30 px-6 py-3'
        : 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      props.class
    )"
  ><slot /></div>
</template>
