<script setup lang="ts">
// Thin wrapper around vee-validate's <Form> — mirrors react-ui's `Form = FormProvider`.
import { Form as VeeForm } from "vee-validate"
defineOptions({ inheritAttrs: false })
</script>
<template>
  <VeeForm v-bind="$attrs" v-slot="slotProps">
    <slot v-bind="slotProps" />
  </VeeForm>
</template>
