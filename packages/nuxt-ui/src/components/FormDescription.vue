<script setup lang="ts">
import { cn } from "../lib/utils"
import { useFormItem, formItemIds } from "./form"

const props = defineProps<{ class?: string }>()
const { id } = useFormItem()
const { formDescriptionId } = formItemIds(id)
</script>
<template>
  <p data-slot="form-description" :id="formDescriptionId" :class="cn('text-muted-foreground text-sm', props.class)">
    <slot />
  </p>
</template>
