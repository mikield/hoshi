<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

type Tone = 'light' | 'medium' | 'dark'

export interface ArcCfg {
  pos: { left?: number; right?: number; top: number }
  size: number
  tone: Tone
  opacity: number
  delay: number
  x: number[]
  y: number[]
  scale: number[]
  blur: string[]
}

const props = withDefaults(defineProps<{
  variant?: 'hero' | 'header'
  blurMultiplier?: number
  sizeMultiplier?: number
  duration?: number
  customArcs?: { left?: Partial<ArcCfg>[]; right?: Partial<ArcCfg>[] }
}>(), {
  variant: 'hero',
  blurMultiplier: 1,
  sizeMultiplier: 1,
  duration: 4.6,
})

const prefersReducedMotion = usePreferredReducedMotion()
const mounted = ref(false)

const instance = getCurrentInstance()
const uid = instance?.uid ?? Math.floor(Math.random() * 1e6)

// ── Arc SVG path data ───────────────────────────────────────────────────
const LEFT_PATH = 'M541.499 151.597C249.646 151.597 13.0527 388.191 13.0527 680.043H-138.506C-138.506 304.487 165.943 0.0385742 541.499 0.0385742V151.597Z'
const RIGHT_PATH = 'M3.50098 155.457C378.985 155.457 683.375 459.847 683.375 835.331H834.934C834.934 376.144 462.688 3.89844 3.50098 3.89844V155.457Z'

const TONE_LEFT: Record<Tone, { c1: string; c2: string; c3: string }> = {
  light:  { c1: '#D9D9D9', c2: '#DEDEDE', c3: '#3B3B3B' },
  medium: { c1: '#C9C9C9', c2: '#D4D4D4', c3: '#2F2F2F' },
  dark:   { c1: '#B9B9B9', c2: '#C8C8C8', c3: '#232323' },
}
const TONE_RIGHT: Record<Tone, string> = {
  light: '#D9D9D9', medium: '#C9C9C9', dark: '#B9B9B9',
}

// ── Default arc configs ─────────────────────────────────────────────────
function adjustBlur(values: string[], m: number): string[] {
  return values.map((b) => `${parseFloat(b) * m}px`)
}
function adjustSize(s: number, m: number): number {
  return Math.round(s * m)
}

const heroLeft: ArcCfg[] = [
  { pos: { left: -190, top: 20 },  size: 400, tone: 'light',  opacity: 0.10, delay: 0.02, x: [0,20,-10,0], y: [0,15,-8,0],  scale: [0.78,1.10,0.90,0.78], blur: ['19px','500px','50px','500px'] },
  { pos: { left: -60,  top: 240 }, size: 600, tone: 'dark',   opacity: 0.22, delay: 1.10, x: [0,22,-14,0], y: [0,16,-12,0], scale: [0.82,1.15,0.95,0.82], blur: ['1px','0px','0px','1px'] },
]
const heroRight: ArcCfg[] = [
  { pos: { right: -85, top: 100 }, size: 620, tone: 'dark',   opacity: 0.23, delay: 1.50, x: [0,-25,15,0], y: [0,18,-12,0], scale: [0.84,1.20,1.00,0.84], blur: ['1px','0px','0px','1px'] },
  { pos: { right: -0,  top: 570 }, size: 220, tone: 'light',  opacity: 0.08, delay: 0.30, x: [0,-20,10,0], y: [0,15,-8,0],  scale: [0.80,1.10,0.90,0.80], blur: ['500px','500px','500px','500px'] },
]

function makeHeaderLeft(bm: number, sm: number): ArcCfg[] {
  return [
    { pos: { left: -150, top: -50 }, size: adjustSize(450, sm), tone: 'light',  opacity: 0.20, delay: 0.02, x: [0,15,-8,0], y: [0,10,-5,0], scale: [0.85,1.05,0.95,0.85], blur: adjustBlur(['12px','18px','15px','12px'], bm) },
    { pos: { left: -40,  top: 100 }, size: adjustSize(520, sm), tone: 'medium', opacity: 0.25, delay: 0.80, x: [0,18,-10,0], y: [0,12,-8,0], scale: [0.88,1.12,0.98,0.88], blur: adjustBlur(['8px','4px','6px','8px'], bm) },
  ]
}
function makeHeaderRight(bm: number, sm: number): ArcCfg[] {
  return [
    { pos: { right: -140, top: -50 }, size: adjustSize(550, sm), tone: 'dark',  opacity: 0.28, delay: 1.20, x: [0,-20,12,0], y: [0,14,-9,0], scale: [0.90,1.15,1.00,0.90], blur: adjustBlur(['10px','4px','7px','10px'], bm) },
    { pos: { right: 300,  top: 140 }, size: adjustSize(280, sm), tone: 'light', opacity: 0.18, delay: 0.40, x: [0,-15,8,0],  y: [0,10,-6,0], scale: [0.92,1.08,0.98,0.92], blur: adjustBlur(['20px','28px','24px','20px'], bm) },
  ]
}

function mergeArcs(defaults: ArcCfg[], custom?: Partial<ArcCfg>[]): ArcCfg[] {
  if (!custom?.length) return defaults
  return custom.map((c, i) => {
    const d = defaults[i] ?? defaults[0]
    return {
      pos:     c.pos     ?? d.pos,
      size:    c.size    ?? d.size,
      tone:    c.tone    ?? d.tone,
      opacity: c.opacity ?? d.opacity,
      delay:   c.delay   ?? d.delay,
      x:       c.x       ?? d.x,
      y:       c.y       ?? d.y,
      scale:   c.scale   ?? d.scale,
      blur:    c.blur     ?? d.blur,
    }
  })
}

const leftArcs = computed<ArcCfg[]>(() => {
  const base = props.variant === 'header'
    ? makeHeaderLeft(props.blurMultiplier, props.sizeMultiplier)
    : heroLeft
  return mergeArcs(base, props.customArcs?.left)
})

const rightArcs = computed<ArcCfg[]>(() => {
  const base = props.variant === 'header'
    ? makeHeaderRight(props.blurMultiplier, props.sizeMultiplier)
    : heroRight
  return mergeArcs(base, props.customArcs?.right)
})

// ── Dynamic keyframe injection ──────────────────────────────────────────
let styleEl: HTMLStyleElement | null = null

function buildKeyframes(arcs: ArcCfg[], side: 'L' | 'R'): string {
  return arcs.map((arc, i) => {
    const blurs = arc.blur.map((b) => parseFloat(b))
    return `
@keyframes arc-${uid}-${side}${i} {
  0%   { transform: translate(${arc.x[0]}px,${arc.y[0]}px) scale(${arc.scale[0]}); filter: blur(${blurs[0]}px); }
  33%  { transform: translate(${arc.x[1]}px,${arc.y[1]}px) scale(${arc.scale[1]}); filter: blur(${blurs[1]}px); }
  66%  { transform: translate(${arc.x[2]}px,${arc.y[2]}px) scale(${arc.scale[2]}); filter: blur(${blurs[2]}px); }
  100% { transform: translate(${arc.x[3]}px,${arc.y[3]}px) scale(${arc.scale[3]}); filter: blur(${blurs[3]}px); }
}`
  }).join('\n')
}

onMounted(() => {
  mounted.value = true
  styleEl = document.createElement('style')
  styleEl.textContent = buildKeyframes(leftArcs.value, 'L') + buildKeyframes(rightArcs.value, 'R')
  document.head.appendChild(styleEl)
})

onUnmounted(() => {
  styleEl?.remove()
})

// ── Per-arc inline styles ───────────────────────────────────────────────
function arcStyle(arc: ArcCfg, side: 'L' | 'R', index: number): Record<string, string> {
  return {
    position: 'absolute',
    left:  arc.pos.left  != null ? `${arc.pos.left}px`  : '',
    right: arc.pos.right != null ? `${arc.pos.right}px` : '',
    top:   `${arc.pos.top}px`,
    willChange: 'transform',
    transform: 'translate3d(0,0,0)',
    animation: `arc-${uid}-${side}${index} ${props.duration}s cubic-bezier(0.85,0,0.06,1.01) ${arc.delay}s infinite`,
  }
}

// ── SVG helpers ─────────────────────────────────────────────────────────
function leftGradId(tone: Tone, index: number, g: 0 | 1) {
  return `L${g}_${tone}_${uid}_${index}`
}
function rightGradId(tone: Tone, index: number) {
  return `R0_${tone}_${uid}_${index}`
}
function leftMaskId(tone: Tone, index: number) { return `Lmask_${uid}_${index}_${tone}` }
function leftEdgeId(tone: Tone, index: number) { return `Ledge_${uid}_${index}_${tone}` }
function leftGrainId(tone: Tone, index: number) { return `Lgrain_${uid}_${index}_${tone}` }
function rightMaskId(tone: Tone, index: number) { return `Rmask_${uid}_${index}_${tone}` }
function rightEdgeId(tone: Tone, index: number) { return `Redge_${uid}_${index}_${tone}` }
function rightGrainId(tone: Tone, index: number) { return `Rgrain_${uid}_${index}_${tone}` }
</script>

<template>
  <!-- Static placeholder for SSR / reduced motion -->
  <div
    v-if="!mounted || prefersReducedMotion === 'reduce'"
    :class="['absolute inset-0 overflow-hidden pointer-events-none', variant === 'header' ? 'z-0' : '-z-10']"
    aria-hidden="true"
  >
    <div
      class="absolute inset-0 opacity-20"
      style="background: radial-gradient(ellipse at 20% 30%, rgba(200,200,200,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 40%, rgba(180,180,180,0.12) 0%, transparent 45%)"
    />
    <div v-if="variant === 'hero'" class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
  </div>

  <!-- Animated arcs -->
  <div
    v-else
    :class="['absolute inset-0 overflow-hidden pointer-events-none', variant === 'header' ? 'z-0' : '-z-10']"
    style="transform: translateZ(0); -webkit-transform: translateZ(0)"
    aria-hidden="true"
  >
    <div class="absolute inset-0">
      <!-- Left arcs -->
      <div
        v-for="(arc, i) in leftArcs"
        :key="`L${i}`"
        :style="arcStyle(arc, 'L', i)"
      >
        <svg
          :width="arc.size"
          :height="arc.size * (520 / 542)"
          viewBox="-50 -50 642 620"
          fill="none"
          style="overflow: visible; will-change: transform; transform: translate3d(0,0,0)"
        >
          <defs>
            <linearGradient :id="leftGradId(arc.tone, i, 0)" x1="201.497" y1="0.0386" x2="201.497" y2="680.043" gradientUnits="userSpaceOnUse">
              <stop :stop-color="TONE_LEFT[arc.tone].c1" />
              <stop offset="1" stop-opacity="0" />
            </linearGradient>
            <linearGradient :id="leftGradId(arc.tone, i, 1)" x1="541.499" y1="401.469" x2="-138.506" y2="401.469" gradientUnits="userSpaceOnUse">
              <stop :stop-color="TONE_LEFT[arc.tone].c2" />
              <stop offset="1" :stop-color="TONE_LEFT[arc.tone].c3" />
            </linearGradient>
            <filter :id="leftEdgeId(arc.tone, i)" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <mask :id="leftMaskId(arc.tone, i)" maskUnits="userSpaceOnUse">
              <g :filter="`url(#${leftEdgeId(arc.tone, i)})`">
                <path :d="LEFT_PATH" fill="#fff" />
              </g>
            </mask>
            <pattern :id="leftGrainId(arc.tone, i)" patternUnits="userSpaceOnUse" width="100" height="100">
              <image href="/grain-texture.png" x="0" y="0" width="100" height="100" preserveAspectRatio="none" />
            </pattern>
          </defs>
          <g :opacity="arc.opacity">
            <path :d="LEFT_PATH" :fill="`url(#${leftGradId(arc.tone, i, 0)})`" />
            <path :d="LEFT_PATH" :fill="`url(#${leftGradId(arc.tone, i, 1)})`" />
            <g :mask="`url(#${leftMaskId(arc.tone, i)})`" style="mix-blend-mode: overlay" :opacity="0.6" pointer-events="none">
              <rect x="0" y="0" width="120%" height="120%" :fill="`url(#${leftGrainId(arc.tone, i)})`" />
            </g>
          </g>
        </svg>
      </div>

      <!-- Right arcs -->
      <div
        v-for="(arc, i) in rightArcs"
        :key="`R${i}`"
        :style="arcStyle(arc, 'R', i)"
      >
        <svg
          :width="arc.size"
          :height="arc.size * (657 / 532)"
          viewBox="-50 -50 632 757"
          fill="none"
          style="overflow: visible; will-change: transform; transform: translate3d(0,0,0)"
        >
          <defs>
            <linearGradient :id="rightGradId(arc.tone, i)" x1="419.217" y1="3.89844" x2="419.217" y2="835.331" gradientUnits="userSpaceOnUse">
              <stop :stop-color="TONE_RIGHT[arc.tone]" />
              <stop offset="1" stop-opacity="0" />
            </linearGradient>
            <filter :id="rightEdgeId(arc.tone, i)" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <mask :id="rightMaskId(arc.tone, i)" maskUnits="userSpaceOnUse">
              <g :filter="`url(#${rightEdgeId(arc.tone, i)})`">
                <path :d="RIGHT_PATH" fill="#fff" />
              </g>
            </mask>
            <pattern :id="rightGrainId(arc.tone, i)" patternUnits="userSpaceOnUse" width="100" height="100">
              <image href="/grain-texture.png" x="0" y="0" width="100" height="100" preserveAspectRatio="none" />
            </pattern>
          </defs>
          <g :opacity="arc.opacity">
            <g>
              <path :d="RIGHT_PATH" :fill="`url(#${rightGradId(arc.tone, i)})`" />
            </g>
            <g :mask="`url(#${rightMaskId(arc.tone, i)})`" style="mix-blend-mode: overlay" :opacity="0.6" pointer-events="none">
              <rect x="0" y="0" width="120%" height="120%" :fill="`url(#${rightGrainId(arc.tone, i)})`" />
            </g>
          </g>
        </svg>
      </div>
    </div>

    <div v-if="variant === 'hero'" class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
  </div>
</template>
