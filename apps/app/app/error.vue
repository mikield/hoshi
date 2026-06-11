<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'
import { Button, Logo, WallpaperBackground } from '@hoshi/ui'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)
const isMaintenance = computed(() => props.error.statusCode === 503)
const title = computed(() => {
  if (is404.value) return 'This page drifted off'
  if (isMaintenance.value) return 'Down for maintenance'
  return 'Something went wrong'
})
const detail = computed(() => {
  if (is404.value) return "The page you're looking for doesn't exist — it may have moved or never was."
  if (isMaintenance.value) return props.error.statusMessage ?? 'Hoshi is briefly offline while we work on it — back shortly.'
  return props.error.statusMessage ?? 'An unexpected error interrupted the app.'
})

function goHome() {
  clearError({ redirect: '/projects' })
}
</script>

<template>
  <div class="fixed inset-0 overflow-hidden bg-background">
    <WallpaperBackground wallpaper-id="brandmark" />
    <div class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-6 text-center">
      <Logo variant="logo" class="h-4 w-auto opacity-70" />
      <p class="select-none text-7xl font-extralight leading-none tracking-[-0.02em] text-foreground/80 tabular-nums sm:text-8xl">
        {{ error.statusCode }}
      </p>
      <div class="space-y-1.5">
        <h1 class="text-lg font-semibold tracking-tight text-foreground">{{ title }}</h1>
        <p class="mx-auto max-w-sm text-sm text-muted-foreground">{{ detail }}</p>
      </div>
      <Button class="mt-2 rounded-full" @click="goHome">Back to your projects</Button>
    </div>
  </div>
</template>
