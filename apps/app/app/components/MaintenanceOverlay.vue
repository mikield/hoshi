<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { Button, StatusScreen } from '@hoshi/ui'
import { RefreshCw } from 'lucide-vue-next'

const CHECK_EVERY_MS = 30_000

const store = useMaintenanceStore()
const { active, message } = storeToRefs(store)

let timer: ReturnType<typeof setInterval> | null = null

// immediate: maintenance raised during SSR hydrates as already-active, and
// the poll must start for that case too.
watch(active, (isActive) => {
  if (timer) clearInterval(timer)
  timer = isActive ? setInterval(() => void store.checkNow(), CHECK_EVERY_MS) : null
}, { immediate: true })

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <!-- Below the inactivity lock (z-100), above everything else. -->
      <div v-if="active" class="fixed inset-0 z-[90]" role="alertdialog" aria-label="Maintenance">
        <StatusScreen
          variant="maintenance"
          title="We'll be right back"
          :description="message ?? 'Hoshi is briefly offline while we work on it. Your sessions are safe — please check back soon.'"
        >
          <template #actions>
            <Button variant="outline" size="lg" class="h-12 gap-2 rounded-full" @click="store.checkNow()">
              <RefreshCw class="size-4" />
              Check again now
            </Button>
          </template>

          <p class="text-xs text-muted-foreground/60">This screen checks back automatically every 30 seconds.</p>
        </StatusScreen>
      </div>
    </Transition>
  </Teleport>
</template>
