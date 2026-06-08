<script setup lang="ts">
import { cn } from "../lib/utils"

interface Props {
  class?: string
  compact?: boolean
  clickable?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{ click: [] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault()
    emit("click")
  }
}
</script>
<template>
  <li>
    <div
      v-bind="clickable ? { role: 'button', tabindex: 0, onClick: () => emit('click'), onKeydown } : {}"
      :class="cn(
        'group flex items-center gap-3 px-6 py-3',
        clickable && 'cursor-pointer transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none',
        props.class
      )"
    >
      <div v-if="$slots.leading" class="shrink-0"><slot name="leading" /></div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <span :class="cn('truncate text-sm font-medium text-foreground', compact && 'leading-none')"><slot name="title" /></span>
          <slot name="badges" />
        </div>
        <div v-if="$slots.subtitle" :class="compact ? 'text-xs leading-none' : 'mt-0.5'"><slot name="subtitle" /></div>
      </div>
      <div v-if="$slots.trailing" class="flex shrink-0 items-center gap-1.5"><slot name="trailing" /></div>
    </div>
  </li>
</template>
