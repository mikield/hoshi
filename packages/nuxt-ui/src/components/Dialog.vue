<script setup lang="ts">
import { DialogRoot } from "reka-ui"
import { useDialogDepth, provideDialogDepth } from "../lib/z-stack"
defineOptions({ inheritAttrs: false })

const parentDepth = useDialogDepth()
provideDialogDepth(parentDepth + 1)
</script>
<template>
  <DialogRoot data-slot="dialog" v-bind="$attrs">
    <slot />
  </DialogRoot>
</template>
