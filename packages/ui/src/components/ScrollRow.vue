<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '../lib/utils'

/** Horizontal scroller for chip rows: hidden scrollbar, edge fades, and
 *  chevron buttons that only appear when that direction can actually scroll —
 *  no overflow, no chrome. Trackpads swipe natively; the arrows page by ~80%
 *  of the visible width. */
const props = defineProps<{ class?: string }>()

const scroller = ref<HTMLElement | null>(null)
const canLeft = ref(false)
const canRight = ref(false)

function update() {
  const el = scroller.value
  if (!el) return
  canLeft.value = el.scrollLeft > 1
  canRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

function page(direction: 1 | -1) {
  const el = scroller.value
  el?.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
}

let observer: ResizeObserver | null = null

onMounted(() => {
  update()
  // Container and content can both change size (async data, breakpoints).
  observer = new ResizeObserver(update)
  if (scroller.value) {
    observer.observe(scroller.value)
    if (scroller.value.firstElementChild) observer.observe(scroller.value.firstElementChild)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div :class="cn('relative', props.class)">
    <!-- Edge fades — content visibly continues under them -->
    <div
      aria-hidden="true"
      :class="cn(
        'pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent transition-opacity duration-200',
        canLeft ? 'opacity-100' : 'opacity-0',
      )"
    />
    <div
      aria-hidden="true"
      :class="cn(
        'pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent transition-opacity duration-200',
        canRight ? 'opacity-100' : 'opacity-0',
      )"
    />

    <!-- Arrows — present only while that direction has somewhere to go -->
    <button
      type="button"
      aria-label="Scroll left"
      :tabindex="canLeft ? 0 : -1"
      :class="cn(
        'absolute left-0 top-1/2 z-20 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-all duration-200 hover:border-foreground/30 hover:text-foreground',
        canLeft ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-1 opacity-0',
      )"
      @click="page(-1)"
    >
      <ChevronLeft class="size-3.5" />
    </button>
    <button
      type="button"
      aria-label="Scroll right"
      :tabindex="canRight ? 0 : -1"
      :class="cn(
        'absolute right-0 top-1/2 z-20 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-all duration-200 hover:border-foreground/30 hover:text-foreground',
        canRight ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-1 opacity-0',
      )"
      @click="page(1)"
    >
      <ChevronRight class="size-3.5" />
    </button>

    <div
      ref="scroller"
      class="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      @scroll.passive="update"
    >
      <slot />
    </div>
  </div>
</template>
