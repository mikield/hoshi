<script setup lang="ts">
import { cn } from "../lib/utils"

interface Props {
  class?: string
  type?: string
  modelValue?: string | number
}
const props = withDefaults(defineProps<Props>(), { type: "text" })
const emit = defineEmits<{ "update:modelValue": [value: string] }>()
</script>

<template>
  <input
    :type="type"
    data-slot="input"
    :value="modelValue"
    :class="cn(
      'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-11 w-full min-w-0 rounded-2xl border bg-card px-3 py-1 text-sm font-medium transition-[color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      'focus:outline-none focus:ring-2 focus:ring-primary/50',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      props.class
    )"
    v-bind="$attrs"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
