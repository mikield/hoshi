<script setup lang="ts">
import { cn } from "../lib/utils"
import { useFormItem, formItemIds } from "./form"

const props = defineProps<{ class?: string; error?: string }>()
const { id } = useFormItem()
const { formMessageId } = formItemIds(id)
</script>
<template>
  <p
    v-if="error || $slots.default"
    data-slot="form-message"
    :id="formMessageId"
    :class="cn('text-destructive text-sm', props.class)"
  >
    {{ error }}<slot v-if="!error" />
  </p>
</template>
