<script setup lang="ts">
import { cn } from "../lib/utils"
import { useFormItem, formItemIds } from "./form"
import Label from "./Label.vue"

const props = defineProps<{ class?: string; error?: boolean }>()
const { id } = useFormItem()
const { formItemId } = formItemIds(id)
</script>
<template>
  <Label
    data-slot="form-label"
    :data-error="!!error"
    :for="formItemId"
    :class="cn('data-[error=true]:text-destructive', props.class)"
  >
    <slot />
  </Label>
</template>
