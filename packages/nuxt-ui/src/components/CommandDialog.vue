<script setup lang="ts">
import { cn } from "../lib/utils"
import Dialog from "./Dialog.vue"
import DialogContent from "./DialogContent.vue"
import DialogHeader from "./DialogHeader.vue"
import DialogTitle from "./DialogTitle.vue"
import DialogDescription from "./DialogDescription.vue"
import Command from "./Command.vue"

interface Props {
  class?: string
  title?: string
  description?: string
  open?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  title: "Command Palette",
  description: "Search for a command to run...",
})
const emit = defineEmits<{ "update:open": [value: boolean] }>()

const CMDK_SHARED_CLASSES = "[&_[data-command-group]]:px-1.5 [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0"
</script>
<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogHeader class="sr-only">
      <DialogTitle>{{ title }}</DialogTitle>
      <DialogDescription>{{ description }}</DialogDescription>
    </DialogHeader>
    <DialogContent
      :class="cn(
        `overflow-hidden p-0 gap-0
        border border-border/60 rounded-2xl ring-1 ring-inset ring-white/[0.04]
        bg-popover
        data-[state=open]:slide-in-from-top-[2%] data-[state=closed]:slide-out-to-top-[2%]
        [&_[data-slot=command-item]]:gap-3 [&_[data-slot=command-item]]:rounded-lg [&_[data-slot=command-item]]:px-3 [&_[data-slot=command-item]]:py-2.5 [&_[data-slot=command-item]]:text-sm
        [&_[data-slot=command-item]_svg:not([class*='size-'])]:size-[17px]`,
        props.class
      )"
      hide-close-button
    >
      <Command :class="CMDK_SHARED_CLASSES">
        <slot />
      </Command>
    </DialogContent>
  </Dialog>
</template>
