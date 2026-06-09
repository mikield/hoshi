<script setup lang="ts">
import { ref, provide } from "vue"
import { cn } from "../lib/utils"

interface Props {
  class?: string
  shouldFilter?: boolean
}
const props = withDefaults(defineProps<Props>(), { shouldFilter: true })

const search = ref("")
provide("command-search", search)
provide("command-should-filter", props.shouldFilter)

const root = ref<HTMLElement | null>(null)

function getItems(): HTMLElement[] {
  if (!root.value) return []
  return Array.from(
    root.value.querySelectorAll<HTMLElement>('[data-slot="command-item"]:not([data-disabled])')
  ).filter((el) => el.offsetParent !== null)
}

function getHighlighted(): HTMLElement | null {
  return root.value?.querySelector<HTMLElement>('[data-slot="command-item"][data-highlighted]') ?? null
}

function highlight(el: HTMLElement | null) {
  getItems().forEach((item) => item.removeAttribute("data-highlighted"))
  if (el) {
    el.setAttribute("data-highlighted", "")
    el.scrollIntoView({ block: "nearest" })
  }
}

function move(dir: 1 | -1) {
  const items = getItems()
  if (!items.length) return
  const current = getHighlighted()
  const idx = current ? items.indexOf(current) : -1
  // When nothing highlighted and going up, start from the last item
  const next = items[idx === -1 && dir === -1 ? items.length - 1 : (idx + dir + items.length) % items.length]
  highlight(next)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowDown") {
    e.preventDefault()
    move(1)
  } else if (e.key === "ArrowUp") {
    e.preventDefault()
    move(-1)
  } else if (e.key === "Enter") {
    const highlighted = getHighlighted()
    if (highlighted) {
      e.preventDefault()
      highlighted.click()
    }
  }
}
</script>
<template>
  <div
    ref="root"
    data-slot="command"
    :class="cn('bg-transparent text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-2xl', props.class)"
    @keydown="handleKeydown"
  >
    <slot />
  </div>
</template>
