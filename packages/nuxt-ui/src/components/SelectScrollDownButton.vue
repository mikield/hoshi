<script setup lang="ts">
import { SelectScrollDownButton as Primitive } from "reka-ui"
import { ChevronDownIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <Primitive data-slot="select-scroll-down-button" :class="cn('flex cursor-default items-center justify-center py-1', props.class)">
    <ChevronDownIcon class="size-4" />
  </Primitive>
</template>
