<script setup lang="ts">
import { computed } from "vue"
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from "reka-ui"
import { cn } from "../lib/utils"

interface Props {
  class?: string
  modelValue?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
}
const props = withDefaults(defineProps<Props>(), { min: 0, max: 100, step: 1 })
const emit = defineEmits<{ (e: "update:modelValue", value: number[]): void }>()

const values = computed(() =>
  Array.isArray(props.modelValue) ? props.modelValue : Array.isArray(props.defaultValue) ? props.defaultValue : [props.min]
)
</script>
<template>
  <SliderRoot
    data-slot="slider"
    :model-value="modelValue"
    :default-value="defaultValue"
    :min="min"
    :max="max"
    :step="step"
    @update:model-value="emit('update:modelValue', $event)"
    :class="cn(
      'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
      props.class
    )"
  >
    <SliderTrack
      data-slot="slider-track"
      class="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
    >
      <SliderRange data-slot="slider-range" class="cursor-pointer bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, index) in values"
      :key="index"
      data-slot="slider-thumb"
      class="cursor-pointer border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderRoot>
</template>
