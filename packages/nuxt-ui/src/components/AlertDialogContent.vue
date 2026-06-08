<script setup lang="ts">
import { computed } from "vue"
import { AlertDialogContent as Primitive } from "reka-ui"
import { cn } from "../lib/utils"
import { dialogContentZ, useDialogDepth } from "../lib/z-stack"
import AlertDialogPortal from "./AlertDialogPortal.vue"
import AlertDialogOverlay from "./AlertDialogOverlay.vue"

const props = defineProps<{ class?: string }>()
const depth = useDialogDepth()
const z = computed(() => dialogContentZ(depth))
</script>
<template>
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <Primitive
      data-slot="alert-dialog-content"
      :style="{ zIndex: z }"
      :class="cn(
        'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border p-6 shadow-lg duration-200 sm:max-w-md',
        props.class
      )"
    >
      <slot />
    </Primitive>
  </AlertDialogPortal>
</template>
