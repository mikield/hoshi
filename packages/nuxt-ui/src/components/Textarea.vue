<script setup lang="ts">
import { cn } from "../lib/utils"

const props = defineProps<{ class?: string; modelValue?: string }>()
const emit = defineEmits<{ "update:modelValue": [value: string] }>()
</script>

<template>
  <textarea
    data-slot="textarea"
    :value="modelValue"
    :class="cn(
      'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex field-sizing-content min-h-16 w-full rounded-2xl border bg-card px-3 py-2 text-sm font-medium transition-[color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      'focus:outline-none focus:ring-2 focus:ring-primary/50',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      props.class
    )"
    v-bind="$attrs"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
