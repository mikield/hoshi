<script setup lang="ts">
import { X } from "lucide-vue-next"
import { cn } from "../lib/utils"

interface Props {
  name: string
  previewUrl?: string
  class?: string
  removable?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{ remove: [] }>()
</script>
<template>
  <div class="relative group">
    <div :class="cn('flex flex-col w-[120px] rounded-2xl border border-border/50 overflow-hidden', 'bg-card hover:bg-muted/30 hover:border-border transition-colors duration-150 select-none', props.class)">
      <div class="h-[80px] relative flex items-center justify-center overflow-hidden bg-muted/20">
        <img v-if="previewUrl" :src="previewUrl" :alt="name" class="absolute inset-0 w-full h-full object-cover" draggable="false" />
        <slot v-else name="icon" />
      </div>
      <div class="px-2 py-1.5 text-xs text-muted-foreground truncate font-mono">{{ name }}</div>
    </div>
    <button
      v-if="removable"
      type="button"
      class="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background opacity-0 group-hover:opacity-100 transition-opacity"
      @click="emit('remove')"
    >
      <X class="size-3" />
    </button>
  </div>
</template>
