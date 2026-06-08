<script setup lang="ts">
import { computed } from "vue"
import { AlertDialogOverlay as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
import { dialogOverlayZ, useDialogDepth } from "../lib/z-stack"

const props = defineProps<{ class?: string }>()
const depth = useDialogDepth()
const z = computed(() => dialogOverlayZ(depth))
</script>
<template>
  <Primitive
    data-slot="alert-dialog-overlay"
    :style="{ zIndex: z }"
    :class="cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/50 backdrop-blur-xs',
      props.class
    )"
  />
</template>
