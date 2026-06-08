<script setup lang="ts">
import { useId } from "vue"
import { cn } from "../lib/utils"
import { provideFormItem } from "./form"

const props = defineProps<{ class?: string }>()
const id = useId()
provideFormItem({ id })
</script>
<template>
  <div data-slot="form-item" :class="cn('grid gap-2', props.class)">
    <slot />
  </div>
</template>
