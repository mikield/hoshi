<script setup lang="ts">
import { AlertDialogRoot } from "reka-ui"
import { useDialogDepth, provideDialogDepth } from "../lib/z-stack"
defineOptions({ inheritAttrs: false })

const parentDepth = useDialogDepth()
provideDialogDepth(parentDepth + 1)
</script>
<template>
  <AlertDialogRoot data-slot="alert-dialog" v-bind="$attrs"><slot /></AlertDialogRoot>
</template>
