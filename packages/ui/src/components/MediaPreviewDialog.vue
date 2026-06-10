<script setup lang="ts">
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogClose, DialogTitle, VisuallyHidden } from "reka-ui"
import { X } from "lucide-vue-next"

// Fullscreen lightbox for chat media. Click anywhere (or Esc) to dismiss;
// the media renders at natural aspect, capped to the viewport.
defineProps<{ src: string; alt?: string }>()
const open = defineModel<boolean>("open", { default: false })
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:duration-200"
      />
      <DialogContent
        class="fixed inset-0 z-50 flex items-center justify-center p-6 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.97] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.97] data-[state=open]:duration-200"
        @click="open = false"
      >
        <VisuallyHidden>
          <DialogTitle>{{ alt || 'Media preview' }}</DialogTitle>
        </VisuallyHidden>
        <img
          :src="src"
          :alt="alt || 'Media preview'"
          class="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
          @click.stop
        />
        <DialogClose
          class="absolute right-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/80 transition-colors hover:bg-black/60 hover:text-white"
          aria-label="Close preview"
        >
          <X class="size-4" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
