<script setup lang="ts">
import { RadioGroupRoot } from "reka-ui"
import { cn } from "../lib/utils"

const props = defineProps<{ class?: string; modelValue?: string }>()
const emit = defineEmits<{ "update:modelValue": [value: string] }>()
</script>

<template>
  <RadioGroupRoot
    data-slot="radio-group"
    :model-value="modelValue"
    @update:model-value="(v) => emit('update:modelValue', v as string)"
    :class="cn('grid gap-3', props.class)"
  >
    <slot />
  </RadioGroupRoot>
</template>
