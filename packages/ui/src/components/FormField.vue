<script setup lang="ts">
// Mirrors react-ui's FormField (Controller wrapper) using vee-validate's <Field>.
import { Field } from "vee-validate"

const props = defineProps<{ name: string }>()
defineOptions({ inheritAttrs: false })
</script>
<template>
  <Field :name="name" v-slot="slotProps" v-bind="$attrs">
    <slot v-bind="slotProps" />
  </Field>
</template>
