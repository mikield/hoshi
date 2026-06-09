<script setup lang="ts">
import { Label as LabelPrimitive } from "reka-ui"
import { cn } from "../lib/utils"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <LabelPrimitive
    data-slot="label"
    :class="cn(
      'cursor-pointer flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      props.class
    )"
  >
    <slot />
  </LabelPrimitive>
</template>
