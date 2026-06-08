<script setup lang="ts">
import { RadioGroupItem as RadioGroupItemPrimitive, RadioGroupIndicator } from "reka-ui"
import { CircleIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"

const props = defineProps<{ class?: string; value: string }>()
</script>

<template>
  <RadioGroupItemPrimitive
    data-slot="radio-group-item"
    :value="value"
    :class="cn(
      'aspect-square size-4 shrink-0 cursor-pointer rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
      props.class
    )"
  >
    <RadioGroupIndicator data-slot="radio-group-indicator" class="relative flex items-center justify-center">
      <CircleIcon class="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" />
    </RadioGroupIndicator>
  </RadioGroupItemPrimitive>
</template>
