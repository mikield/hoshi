<script setup lang="ts">
import { ref, computed, watch, onUnmounted, type CSSProperties } from "vue"
import { cn } from "../lib/utils"

const THINKING_MESSAGES = [
  "Considering next steps...",
  "Analyzing the problem...",
  "Working through the details...",
  "Piecing it together...",
  "Processing information...",
  "Forming a response...",
  "Reasoning through this...",
  "Evaluating options...",
  "Connecting the dots...",
  "Building on context...",
]

const TYPING_SPEED = 24
const SHIMMER_DURATION = 900
const SHIMMER_COUNT = 2
const SHIMMER_GAP = 400
const SHIMMER_CYCLE = SHIMMER_DURATION + SHIMMER_GAP
const CLEAR_DURATION = 300
const PAUSE_AFTER_CLEAR = 150

type Phase = "typing" | "shimmer" | "clearing"

interface Props {
  statusText?: string
  class?: string
}
const props = defineProps<Props>()

const msgIdx = ref(Math.floor(Math.random() * THINKING_MESSAGES.length))
const phase = ref<Phase>("typing")
const visibleText = ref("")
const opacity = ref(1)
const blur = ref(0)
const shimmerActive = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined
let charCount = 0
let shimmersDone = 0
let prevStatus = props.statusText
let fullText = props.statusText || THINKING_MESSAGES[msgIdx.value % THINKING_MESSAGES.length]

function resolveText(idx: number) {
  return props.statusText || THINKING_MESSAGES[idx % THINKING_MESSAGES.length]
}

function clear() {
  clearTimeout(timer)
}

function runTyping() {
  fullText = resolveText(msgIdx.value)
  charCount = 0
  visibleText.value = ""
  opacity.value = 1
  blur.value = 0
  shimmerActive.value = false

  const tick = () => {
    charCount += 1
    visibleText.value = fullText.slice(0, charCount)
    if (charCount < fullText.length) {
      timer = setTimeout(tick, TYPING_SPEED)
    } else {
      shimmersDone = 0
      timer = setTimeout(() => { phase.value = "shimmer" }, 200)
    }
  }
  timer = setTimeout(tick, TYPING_SPEED)
}

function runShimmer() {
  fullText = resolveText(msgIdx.value)
  visibleText.value = fullText
  opacity.value = 1
  blur.value = 0

  const hasPersistentStatus = Boolean(props.statusText)
  if (hasPersistentStatus) {
    shimmerActive.value = true
    return
  }

  let cancelled = false
  const runSweep = () => {
    if (cancelled) return
    shimmersDone += 1
    shimmerActive.value = true

    timer = setTimeout(() => {
      if (cancelled) return
      shimmerActive.value = false
      if (shimmersDone < SHIMMER_COUNT) {
        timer = setTimeout(runSweep, SHIMMER_GAP)
      } else {
        timer = setTimeout(() => { phase.value = "clearing" }, SHIMMER_GAP)
      }
    }, SHIMMER_DURATION)
  }
  timer = setTimeout(runSweep, 100)
  onPhaseChange(() => { cancelled = true })
}

function runClearing() {
  shimmerActive.value = false
  opacity.value = 0
  blur.value = 4

  timer = setTimeout(() => {
    msgIdx.value = (msgIdx.value + 1) % THINKING_MESSAGES.length
    visibleText.value = ""
    opacity.value = 1
    blur.value = 0
    phase.value = "typing"
  }, CLEAR_DURATION + PAUSE_AFTER_CLEAR)
}

let cleanupFns: (() => void)[] = []
function onPhaseChange(fn: () => void) {
  cleanupFns.push(fn)
}

function runPhase() {
  cleanupFns.forEach((fn) => fn())
  cleanupFns = []
  clear()
  if (phase.value === "typing") runTyping()
  else if (phase.value === "shimmer") runShimmer()
  else runClearing()
}

watch(phase, runPhase, { immediate: true })

watch(() => props.statusText, (next) => {
  if (next === prevStatus) return
  prevStatus = next
  clear()
  phase.value = "clearing"
})

onUnmounted(() => {
  clear()
  cleanupFns.forEach((fn) => fn())
})

const shimmerStyle = computed<CSSProperties>(() => {
  if (!shimmerActive.value) return {}
  return {
    backgroundImage:
      "linear-gradient(90deg, transparent calc(50% - var(--spread)), var(--highlight-soft) calc(50% - var(--spread-soft)), var(--highlight), var(--highlight-soft) calc(50% + var(--spread-soft)), transparent calc(50% + var(--spread))), linear-gradient(var(--base), var(--base))",
    backgroundSize: "220% 100%, auto",
    backgroundRepeat: "no-repeat, padding-box",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    animation: props.statusText
      ? `thinking-shimmer-pause ${SHIMMER_CYCLE}ms linear infinite`
      : `thinking-shimmer ${SHIMMER_DURATION}ms linear forwards`,
    "--spread": `${Math.max((fullText.length || 10) * 1.3, 14)}px`,
    "--spread-soft": `${Math.max((fullText.length || 10) * 0.45, 6)}px`,
    "--base": "var(--shimmer-base)",
    "--highlight": "var(--shimmer-highlight)",
    "--highlight-soft": "var(--shimmer-highlight-soft)",
  } as CSSProperties
})

const innerStyle = computed<CSSProperties>(() => ({
  opacity: opacity.value,
  filter: `blur(${blur.value}px)`,
  transitionDuration: phase.value === "clearing" ? `${CLEAR_DURATION}ms` : "0ms",
  ...shimmerStyle.value,
}))
</script>
<template>
  <span
    :class="cn(
      'relative inline-flex items-center min-h-[1.2em]',
      '[--shimmer-base:#a1a1aa] [--shimmer-highlight:#27272a] [--shimmer-highlight-soft:#3f3f46]',
      'dark:[--shimmer-base:#71717a] dark:[--shimmer-highlight:#f4f4f5] dark:[--shimmer-highlight-soft:#d4d4d8]',
      props.class
    )"
  >
    <span :class="cn('inline-block transition-[opacity,filter]', !shimmerActive && 'text-muted-foreground')" :style="innerStyle">
      {{ visibleText || ' ' }}
    </span>
  </span>
</template>
