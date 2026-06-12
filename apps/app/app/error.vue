<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'
import { Button, StatusScreen } from '@hoshi/ui'
import { ArrowLeft, RefreshCw } from 'lucide-vue-next'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)
// SSR-time 503s can still land here — same maintenance face as the overlay.
const isMaintenance = computed(() => props.error.statusCode === 503)

const title = computed(() => {
  if (is404.value) return 'Page not found'
  if (isMaintenance.value) return "We'll be right back"
  return 'Something went wrong'
})

const description = computed(() => {
  if (is404.value) return "The page you're looking for doesn't exist — it may have moved or never was."
  if (isMaintenance.value)
    return props.error.statusMessage ?? 'Hoshi is briefly offline while we work on it. Please check back soon.'
  return props.error.statusMessage ?? 'An unexpected error interrupted the app. Your work is safe.'
})

function goHome() {
  clearError({ redirect: '/projects' })
}

function retry() {
  clearError()
  window.location.reload()
}
</script>

<template>
  <StatusScreen
    :glyph="isMaintenance ? undefined : String(error.statusCode)"
    :variant="isMaintenance ? 'maintenance' : undefined"
    :title="title"
    :description="description"
  >
    <template #actions>
      <Button size="lg" class="h-12 gap-2 rounded-full" @click="goHome">
        <ArrowLeft class="size-4" />
        Back to your projects
      </Button>
      <Button v-if="!is404" variant="outline" size="lg" class="h-12 gap-2 rounded-full" @click="retry">
        <RefreshCw class="size-4" />
        Try again
      </Button>
    </template>
  </StatusScreen>
</template>
