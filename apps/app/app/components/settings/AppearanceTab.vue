<script setup lang="ts">
import { computed } from 'vue'
import { ThemeSwitch, type ThemeValue } from '@hoshi/ui'

const colorMode = useColorMode()

const theme = computed<ThemeValue>({
  get: () => (colorMode.preference === 'light' || colorMode.preference === 'dark' ? colorMode.preference : 'system'),
  set: (value) => (colorMode.preference = value),
})
</script>

<template>
  <div class="min-w-0 max-w-full space-y-5 overflow-x-hidden p-4 pb-12 sm:space-y-6 sm:p-6 sm:pb-6">
    <div>
      <h3 class="mb-1 text-lg font-semibold">Appearance</h3>
      <p class="text-sm text-muted-foreground">How the app looks on this device.</p>
    </div>

    <div class="rounded-2xl border">
      <div class="flex items-center justify-between gap-4 px-4 py-3">
        <div class="min-w-0 flex-1 space-y-0.5">
          <div class="text-sm font-medium">Theme</div>
          <p class="text-xs text-muted-foreground">Light, dark, or follow your system.</p>
        </div>
        <ThemeSwitch v-model="theme" />
      </div>
    </div>
  </div>
</template>
