<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { cn } from '../lib/utils'

export interface ChatMinimapItem {
  /** Matches the `data-turn-id` attribute on the turn element. */
  id: string
  /** The user message text — shown in the expanded jump list. */
  text: string
}

/** History rail for long threads: a quiet column of dashes (one per user
 *  message, down-sampled) that expands on hover into a jump list. Turn
 *  elements inside `scrollEl` must carry `data-turn-id`. */
const props = defineProps<{
  items: ChatMinimapItem[]
  scrollEl: HTMLElement | null
}>()

// How many dashes the collapsed rail shows at most — longer sessions are
// down-sampled so the rail stays quiet; the expanded list shows everything.
const MAX_DASHES = 12

const activeId = ref<string | null>(null)
const hovered = ref(false)
const listRef = ref<HTMLElement | null>(null)

let leaveTimer: ReturnType<typeof setTimeout> | null = null

function onEnter() {
  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = null
  }
  hovered.value = true
}

function onLeave() {
  leaveTimer = setTimeout(() => {
    hovered.value = false
    leaveTimer = null
  }, 180)
}

const dashes = computed<{ item: ChatMinimapItem; index: number }[]>(() => {
  if (props.items.length <= MAX_DASHES) {
    return props.items.map((item, index) => ({ item, index }))
  }
  return Array.from({ length: MAX_DASHES }, (_, d) => {
    const index = Math.round((d * (props.items.length - 1)) / (MAX_DASHES - 1))
    return { item: props.items[index]!, index }
  })
})

const activeIndex = computed(() => props.items.findIndex((item) => item.id === activeId.value))

/** The dash nearest the active turn lights up. */
const activeDashIndex = computed(() => {
  if (activeIndex.value < 0) return -1
  let best = -1
  let bestDistance = Infinity
  for (const dash of dashes.value) {
    const distance = Math.abs(dash.index - activeIndex.value)
    if (distance < bestDistance) {
      bestDistance = distance
      best = dash.index
    }
  }
  return best
})

// ── Track the turn currently in view ─────────────────────────────────────────

let observer: IntersectionObserver | null = null

function observeTurns() {
  observer?.disconnect()
  observer = null
  const scrollEl = props.scrollEl
  if (!scrollEl || props.items.length === 0) return

  const visible = new Map<string, number>()
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).getAttribute('data-turn-id')
        if (id) visible.set(id, entry.intersectionRatio)
      }
      let bestId: string | null = null
      let bestRatio = 0
      for (const [id, ratio] of visible) {
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = id
        }
      }
      if (bestId) activeId.value = bestId
    },
    { root: scrollEl, threshold: [0, 0.25, 0.5, 0.75, 1] },
  )
  scrollEl.querySelectorAll<HTMLElement>('[data-turn-id]').forEach((el) => observer!.observe(el))
}

watch(
  () => [props.scrollEl, props.items] as const,
  () => void nextTick(observeTurns),
  { immediate: true, deep: false },
)

onBeforeUnmount(() => {
  observer?.disconnect()
  if (leaveTimer) clearTimeout(leaveTimer)
})

// Keep the active row visible while the jump list is open.
watch([hovered, activeId], async () => {
  if (!hovered.value) return
  await nextTick()
  listRef.value
    ?.querySelector<HTMLElement>(`[data-minimap-id="${CSS.escape(activeId.value ?? '')}"]`)
    ?.scrollIntoView({ block: 'nearest' })
})

function jump(id: string) {
  const scrollEl = props.scrollEl
  const target = scrollEl?.querySelector<HTMLElement>(`[data-turn-id="${CSS.escape(id)}"]`)
  if (!scrollEl || !target) return
  const offset =
    target.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top + scrollEl.scrollTop - 24
  scrollEl.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' })
}

function truncate(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}…`
}
</script>

<template>
  <div
    v-if="items.length >= 3"
    class="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-4"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <!-- Collapsed rail — a few quiet dashes -->
    <div
      :class="cn(
        'flex flex-col items-end py-1 transition-opacity duration-200 ease-out',
        hovered ? 'pointer-events-none opacity-0' : 'opacity-100',
      )"
    >
      <button
        v-for="{ item, index } in dashes"
        :key="`${item.id}-${index}`"
        type="button"
        :title="truncate(item.text, 60)"
        class="group pointer-events-auto flex cursor-pointer items-center justify-end px-1.5 py-[3px]"
        @click="jump(item.id)"
      >
        <span
          :class="cn(
            'h-[3px] w-4 rounded-full transition-all duration-150',
            index === activeDashIndex
              ? 'bg-foreground/60'
              : 'bg-muted-foreground/20 group-hover:bg-muted-foreground/40',
          )"
        />
      </button>
    </div>

    <!-- Expanded jump list — every message, on hover -->
    <div
      :class="cn(
        'absolute right-0 top-1/2 origin-right -translate-y-1/2 transition-all duration-200 ease-out',
        hovered ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
      )"
    >
      <div
        ref="listRef"
        class="flex max-h-[60vh] w-[268px] flex-col gap-0.5 overflow-y-auto rounded-2xl border border-border/40 bg-popover/95 p-1.5 shadow-xl backdrop-blur-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          :data-minimap-id="item.id"
          :class="cn(
            'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors duration-100',
            item.id === activeId ? 'bg-muted' : 'hover:bg-muted/50',
          )"
          @click="jump(item.id)"
        >
          <span
            :class="cn(
              'h-[3px] w-3 shrink-0 rounded-full',
              item.id === activeId ? 'bg-foreground/70' : 'bg-muted-foreground/30',
            )"
          />
          <span
            :class="cn(
              'flex-1 truncate text-xs leading-snug',
              item.id === activeId ? 'font-medium text-foreground' : 'text-muted-foreground',
            )"
          >
            {{ truncate(item.text, 44) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
