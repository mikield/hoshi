<script setup lang="ts">
import { Toggle as TogglePrimitive } from "reka-ui"
import { cn } from "../lib/utils"
import { toggleVariants, type ToggleVariants } from "./toggle"

interface Props {
  class?: string
  variant?: ToggleVariants["variant"]
  size?: ToggleVariants["size"]
  modelValue?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()
</script>

<template>
  <TogglePrimitive
    data-slot="toggle"
    :model-value="modelValue"
    @update:model-value="(v) => emit('update:modelValue', v)"
    :class="cn(toggleVariants({ variant, size }), props.class)"
  >
    <slot />
  </TogglePrimitive>
</template>
