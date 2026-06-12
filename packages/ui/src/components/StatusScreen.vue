<script setup lang="ts">
import { cn } from '../lib/utils'
import Logo from './Logo.vue'

/** Full-screen status surface shared by the error page and the maintenance
 *  overlay: faint oversized glyph (or an icon tile via the #icon slot), title,
 *  description, optional extra content and actions — over a quiet noise
 *  texture so the family of "the app can't continue" screens reads as one. */
const props = defineProps<{
  /** Oversized background numeral/text, e.g. "404". Omit when using #icon. */
  glyph?: string
  title: string
  description?: string
  class?: string
}>()

/** Inline fractal noise — no asset, theme-agnostic. */
const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
</script>

<template>
  <div :class="cn('relative flex h-full min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background px-6', props.class)">
    <!-- Noise overlay -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.035]"
      :style="{ backgroundImage: NOISE, backgroundRepeat: 'repeat', backgroundSize: '256px 256px' }"
    />

    <div class="relative z-10 flex w-full max-w-[460px] flex-col items-center gap-6 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      <p v-if="glyph" class="select-none font-mono text-7xl font-bold leading-none tracking-tighter text-foreground/[0.07] sm:text-8xl">
        {{ glyph }}
      </p>
      <slot name="icon" />

      <div class="space-y-3">
        <h1 class="text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">{{ title }}</h1>
        <p v-if="description" class="mx-auto max-w-md px-2 text-sm leading-relaxed text-foreground/60 sm:text-base">
          {{ description }}
        </p>
      </div>

      <slot />

      <div v-if="$slots.actions" class="mt-1 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-center">
        <slot name="actions" />
      </div>
    </div>

    <Logo variant="logo" class="absolute bottom-8 z-10 h-3.5 w-auto opacity-40" />
  </div>
</template>
