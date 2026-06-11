<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { cn } from '../lib/utils'

/** Hover flyout for collapsed-rail icon buttons: the panel opens to the right
 *  of the trigger and stays while the pointer is over either, so it works as
 *  both an expanded label and a quick-pick list (Suna's sidebar pattern). */
const props = defineProps<{
  /** Optional heading row pinned to the top of the panel. */
  label?: string
  class?: string
}>()

const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const position = ref({ top: 0, left: 0 })

let closeTimer: ReturnType<typeof setTimeout> | null = null

function show() {
  cancelClose()
  const rect = triggerRef.value?.getBoundingClientRect()
  if (rect) position.value = { top: rect.top, left: rect.right + 8 }
  open.value = true
}

function scheduleClose() {
  cancelClose()
  closeTimer = setTimeout(() => {
    open.value = false
  }, 180)
}

function cancelClose() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

function onPointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
  open.value = false
}

watch(open, (isOpen) => {
  if (isOpen) {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('pointerdown', onPointerDown, true)
  } else {
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('pointerdown', onPointerDown, true)
  }
})

onBeforeUnmount(() => {
  cancelClose()
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('pointerdown', onPointerDown, true)
})

defineExpose({ close: () => (open.value = false) })
</script>

<template>
  <div ref="triggerRef" @mouseenter="show" @mouseleave="scheduleClose">
    <slot />
  </div>
  <Teleport to="body">
    <div
      v-if="open"
      ref="panelRef"
      :style="{ position: 'fixed', top: `${position.top}px`, left: `${position.left}px` }"
      :class="cn(
        'z-[70] flex max-h-[60vh] w-[260px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-popover text-popover-foreground shadow-lg',
        'animate-in fade-in-0 zoom-in-[0.98] slide-in-from-left-1 duration-100',
        props.class,
      )"
      @mouseenter="cancelClose"
      @mouseleave="scheduleClose"
    >
      <div
        v-if="label"
        class="shrink-0 border-b border-border/50 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60"
      >
        {{ label }}
      </div>
      <slot name="content" />
    </div>
  </Teleport>
</template>
