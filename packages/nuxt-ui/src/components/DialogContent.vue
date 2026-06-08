<script setup lang="ts">
import { computed } from "vue"
import { DialogContent as Primitive } from "reka-ui"
import { XIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"
import { dialogContentZ, useDialogDepth } from "../lib/z-stack"
import DialogPortal from "./DialogPortal.vue"
import DialogOverlay from "./DialogOverlay.vue"
import DialogClose from "./DialogClose.vue"

interface Props {
  class?: string
  hideCloseButton?: boolean
}
const props = withDefaults(defineProps<Props>(), { hideCloseButton: false })
const depth = useDialogDepth()
const z = computed(() => dialogContentZ(depth))
</script>

<template>
  <DialogPortal>
    <DialogOverlay />
    <Primitive
      data-slot="dialog-content"
      :style="{ zIndex: z }"
      :class="cn(
        'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] grid w-full max-w-[calc(100%-2rem)] sm:max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border p-6 shadow-lg duration-200',
        props.class
      )"
    >
      <slot />
      <DialogClose
        v-if="!hideCloseButton"
        class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      >
        <XIcon />
        <span class="sr-only">Close</span>
      </DialogClose>
    </Primitive>
  </DialogPortal>
</template>
