<script setup lang="ts">
import { useFormItem, formItemIds } from "./form"

const props = defineProps<{ error?: boolean }>()
const { id } = useFormItem()
const { formItemId, formDescriptionId, formMessageId } = formItemIds(id)
const describedBy = props.error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
</script>
<template>
  <slot
    data-slot="form-control"
    :id="formItemId"
    :aria-describedby="describedBy"
    :aria-invalid="!!error"
  />
</template>
