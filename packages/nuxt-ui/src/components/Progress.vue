<script setup lang="ts">
import { ProgressRoot, ProgressIndicator } from "reka-ui"
import { cn } from "../lib/utils"

interface Props {
  class?: string
  modelValue?: number
}
const props = defineProps<Props>()
</script>
<template>
  <ProgressRoot data-slot="progress" :model-value="modelValue" :class="cn('bg-primary/20 relative h-3 w-full overflow-hidden rounded-full', props.class)">
    <ProgressIndicator
      data-slot="progress-indicator"
      class="bg-primary h-full w-full flex-1 transition-colors"
      :style="{ transform: `translateX(-${100 - (modelValue || 0)}%)` }"
    />
  </ProgressRoot>
</template>
