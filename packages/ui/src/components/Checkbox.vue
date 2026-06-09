<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from "reka-ui"
import { CheckIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"

interface Props {
  class?: string
  modelValue?: boolean | "indeterminate"
}
const props = defineProps<Props>()
const emit = defineEmits<{ "update:modelValue": [value: boolean | "indeterminate"] }>()
</script>

<template>
  <CheckboxRoot
    data-slot="checkbox"
    :model-value="modelValue"
    @update:model-value="(v) => emit('update:modelValue', v)"
    :class="cn(
      'peer cursor-pointer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-2xl border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
  >
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="flex items-center justify-center text-current transition-none"
    >
      <CheckIcon class="size-3.5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
