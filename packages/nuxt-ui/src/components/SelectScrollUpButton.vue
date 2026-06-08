<script setup lang="ts">
import { SelectScrollUpButton as Primitive } from "reka-ui"
import { ChevronUpIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <Primitive data-slot="select-scroll-up-button" :class="cn('flex cursor-default items-center justify-center py-1', props.class)">
    <ChevronUpIcon class="size-4" />
  </Primitive>
</template>
