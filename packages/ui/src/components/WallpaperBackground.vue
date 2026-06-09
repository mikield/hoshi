<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../lib/utils'
import { getWallpaperById, DEFAULT_WALLPAPER_ID } from './wallpapers'
import AnimatedBg from './AnimatedBg.vue'

const props = withDefaults(defineProps<{
  wallpaperId?: string
  preview?: boolean
}>(), {
  wallpaperId: DEFAULT_WALLPAPER_ID,
  preview: false,
})

const wallpaper = computed(() => getWallpaperById(props.wallpaperId))
const centerTopClass = computed(() => props.preview ? 'top-[50%]' : 'top-[46%]')
</script>

<template>
  <!-- ── Variant 1: Brandmark — oversized faded SVG outline ── -->
  <div
    v-if="wallpaper.type === 'svg'"
    class="absolute inset-0 pointer-events-none overflow-hidden"
    aria-hidden="true"
  >
    <img
      :src="wallpaper.svgUrl"
      alt=""
      :class="cn(
        'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] sm:w-[160%] lg:w-[162%] h-auto object-contain select-none opacity-[0.07] dark:opacity-[0.12] invert dark:invert-0',
        centerTopClass,
      )"
      draggable="false"
    />
  </div>

  <!-- ── Variant 2: Symbol — tiny centered mark at ghost opacity ── -->
  <div
    v-else-if="wallpaper.type === 'symbol'"
    class="absolute inset-0 pointer-events-none overflow-hidden"
    aria-hidden="true"
  >
    <img
      :src="wallpaper.symbolUrl"
      alt=""
      :class="cn(
        'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,9%,130px)] h-auto object-contain select-none opacity-100 dark:invert',
        centerTopClass,
      )"
      draggable="false"
    />
  </div>

  <!-- ── Variant 3: Aurora — breathing arc arcs + logomark ── -->
  <div
    v-else-if="wallpaper.type === 'aurora'"
    class="absolute inset-0 pointer-events-none overflow-hidden"
    aria-hidden="true"
    style="container-type: size"
  >
    <!-- Arc layer scaled to 1280×720 reference frame -->
    <div
      class="absolute top-0 left-0 origin-top-left"
      :style="{
        width: '1280px',
        height: '720px',
        transform: 'scaleX(calc(100cqw / 1280px)) scaleY(calc(100cqh / 720px))',
      }"
    >
      <AnimatedBg
        variant="hero"
        :blur-multiplier="1.4"
        :size-multiplier="1"
        :duration="12"
        :custom-arcs="{
          left: [
            { pos: { left: -160, top: -40 },  size: 500, tone: 'medium', opacity: 0.14, delay: 0,   x: [0,7,-4,0], y: [0,5,-3,0], scale: [0.88,1.04,0.94,0.88], blur: ['8px','14px','10px','8px'] },
            { pos: { left: -80,  top: 280 },  size: 580, tone: 'dark',   opacity: 0.18, delay: 1.8, x: [0,8,-5,0], y: [0,6,-3,0], scale: [0.90,1.05,0.95,0.90], blur: ['4px','10px','6px','4px'] },
          ],
          right: [
            { pos: { right: -140, top: -20 }, size: 540, tone: 'dark',   opacity: 0.16, delay: 0.9, x: [0,-7,4,0], y: [0,6,-3,0], scale: [0.89,1.05,0.95,0.89], blur: ['6px','12px','8px','6px'] },
            { pos: { right: -60,  top: 320 }, size: 440, tone: 'light',  opacity: 0.10, delay: 2.5, x: [0,-6,3,0], y: [0,5,-3,0], scale: [0.92,1.03,0.96,0.92], blur: ['12px','20px','16px','12px'] },
          ],
        }"
      />
    </div>

    <!-- Logomark, sized relative to actual container -->
    <img
      :src="wallpaper.svgUrl"
      alt=""
      :class="cn(
        'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(48px,13%,170px)] h-auto object-contain select-none invert dark:invert-0',
        centerTopClass,
      )"
      draggable="false"
    />
  </div>

  <!-- ── Variant 4: Shader — CSS gradient fallback (WebGL pending Vue port) ── -->
  <div
    v-else-if="wallpaper.type === 'shader'"
    class="absolute inset-0 pointer-events-none overflow-hidden"
    aria-hidden="true"
  >
    <!-- Gradient placeholder — swap this for a Vue WebGL component when ready -->
    <div
      class="absolute inset-0"
      :class="wallpaper.id === 'matrix'
        ? 'bg-[#0b1410]'
        : 'bg-background'"
    >
      <div
        class="absolute inset-0 opacity-30"
        :style="wallpaper.id === 'matrix'
          ? 'background: radial-gradient(ellipse at 50% 50%, rgba(64,255,92,0.15) 0%, transparent 70%)'
          : 'background: radial-gradient(ellipse at 20% 30%, rgba(200,200,200,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 40%, rgba(180,180,180,0.12) 0%, transparent 45%)'"
      />
    </div>

    <img
      :src="wallpaper.svgUrl"
      alt=""
      :class="cn(
        'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(48px,13%,170px)] h-auto object-contain select-none opacity-90 drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] invert dark:invert-0',
        wallpaper.id === 'ascii-tunnel' ? 'top-[50%]' : centerTopClass,
      )"
      draggable="false"
    />
  </div>

  <!-- ── Variant 5: Image wallpaper — light + dark pair ── -->
  <div
    v-else
    class="absolute inset-0 pointer-events-none overflow-hidden"
    aria-hidden="true"
  >
    <img
      v-if="wallpaper.darkUrl"
      :src="wallpaper.darkUrl"
      alt=""
      class="absolute inset-0 w-full h-full object-cover select-none hidden dark:block"
      draggable="false"
    />
    <img
      v-if="wallpaper.lightUrl"
      :src="wallpaper.lightUrl"
      alt=""
      class="absolute inset-0 w-full h-full object-cover select-none dark:hidden"
      draggable="false"
    />
    <div class="absolute inset-0 bg-black/5 dark:bg-black/20" />
  </div>
</template>
