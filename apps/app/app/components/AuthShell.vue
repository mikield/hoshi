<script setup lang="ts">
import { cn } from '@hoshi/ui'

export type AuthMode = 'signin' | 'register'

defineProps<{
  mode: AuthMode
  title: string
  description: string
}>()

/** Arc wallpaper stand-in for `WallpaperBackground` — concentric circle segments, faint on dark. */
const arcs = [
  { cx: '20%', cy: '15%', r: 260 },
  { cx: '82%', cy: '20%', r: 320 },
  { cx: '15%', cy: '85%', r: 300 },
  { cx: '85%', cy: '88%', r: 260 },
]
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]">
    <!-- ArcBackdrop -->
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <circle
        v-for="(a, i) in arcs"
        :key="i"
        :cx="a.cx"
        :cy="a.cy"
        :r="a.r"
        fill="none"
        stroke="white"
        :stroke-width="1"
      />
    </svg>

    <div class="relative z-10 mx-4 w-full max-w-[360px]">
      <div class="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-2xl">
        <div class="mb-5 flex items-center justify-center">
          <div class="inline-flex items-center gap-0.5 rounded-full bg-white/[0.05] p-1">
            <NuxtLink
              to="/login"
              :class="cn(
                'rounded-full px-4 py-1.5 text-sm transition-colors',
                mode === 'signin' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/50 hover:text-white/80',
              )"
            >
              Sign in
            </NuxtLink>
            <NuxtLink
              to="/register"
              :class="cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                mode === 'register' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/50 hover:text-white/80',
              )"
            >
              Register
            </NuxtLink>
          </div>
        </div>

        <div class="mb-5 text-center">
          <h1 class="text-base font-medium tracking-tight text-white/90">{{ title }}</h1>
          <p class="mt-0.5 text-sm text-white/40">{{ description }}</p>
        </div>

        <slot />

        <div class="my-5 flex items-center gap-3">
          <div class="h-px flex-1 bg-white/[0.08]" />
          <span class="text-xs uppercase tracking-wider text-white/40">or</span>
          <div class="h-px flex-1 bg-white/[0.08]" />
        </div>

        <button
          type="button"
          disabled
          title="Google sign-in isn't wired up in this gallery build"
          class="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/70 transition-colors"
        >
          <svg class="size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div v-if="$slots.footer" class="mt-5 text-center text-sm text-white/40">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
