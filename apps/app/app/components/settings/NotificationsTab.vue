<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Button, Switch } from '@hoshi/ui'
import { Bell, CircleAlert, MessageCircleQuestion, Send, Sparkles } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const alerts = useAlertsStore()
const { prefs } = storeToRefs(alerts)

// Resolved on mount — Notification doesn't exist during SSR.
const permission = ref<NotificationPermission | 'unsupported'>('unsupported')
onMounted(() => {
  permission.value = typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
})

const blocked = computed(() => permission.value === 'denied')

async function toggleMaster(enabled: boolean) {
  await alerts.setNotifications(enabled)
  if (typeof Notification !== 'undefined') permission.value = Notification.permission
  if (enabled && !prefs.value.notifications) {
    toast.error('Notifications are blocked — allow them in your browser settings first.')
  }
}

function sendTest() {
  alerts.sendTestNotification()
  toast.success('Test notification sent')
}
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h3 class="mb-1 text-lg font-semibold">Notifications</h3>
      <p class="text-sm text-muted-foreground">Desktop alerts for session activity while you're away.</p>
    </div>

    <!-- Master toggle -->
    <div class="rounded-2xl border p-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-1 items-start gap-3">
          <Bell class="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div class="flex-1 space-y-0.5">
            <div class="text-sm font-medium">Enable notifications</div>
            <p class="text-xs text-muted-foreground">
              {{ blocked
                ? 'Blocked by the browser — allow notifications for this site in your browser settings.'
                : 'Alerts fire only while this tab is in the background.' }}
            </p>
          </div>
        </div>
        <Switch
          :model-value="prefs.notifications"
          :disabled="blocked"
          aria-label="Enable notifications"
          @update:model-value="(value) => toggleMaster(Boolean(value))"
        />
      </div>
    </div>

    <!-- Per-type toggles -->
    <div class="divide-y rounded-2xl border" :class="!prefs.notifications && 'opacity-50'">
      <div class="flex items-start justify-between gap-4 px-4 py-3">
        <div class="flex flex-1 items-start gap-3">
          <Sparkles class="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div class="flex-1 space-y-0.5">
            <div class="text-sm font-medium">Session finished</div>
            <p class="text-xs text-muted-foreground">The agent completed a turn while you were away.</p>
          </div>
        </div>
        <Switch v-model="prefs.notifyComplete" :disabled="!prefs.notifications" aria-label="Notify when a session finishes" />
      </div>
      <div class="flex items-start justify-between gap-4 px-4 py-3">
        <div class="flex flex-1 items-start gap-3">
          <MessageCircleQuestion class="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div class="flex-1 space-y-0.5">
            <div class="text-sm font-medium">Needs your input</div>
            <p class="text-xs text-muted-foreground">The agent asked a question and is waiting.</p>
          </div>
        </div>
        <Switch v-model="prefs.notifyInput" :disabled="!prefs.notifications" aria-label="Notify when the agent needs input" />
      </div>
      <div class="flex items-start justify-between gap-4 px-4 py-3">
        <div class="flex flex-1 items-start gap-3">
          <CircleAlert class="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div class="flex-1 space-y-0.5">
            <div class="text-sm font-medium">Errors</div>
            <p class="text-xs text-muted-foreground">A session failed or lost its connection.</p>
          </div>
        </div>
        <Switch v-model="prefs.notifyError" :disabled="!prefs.notifications" aria-label="Notify on errors" />
      </div>
    </div>

    <Button variant="outline" size="sm" class="gap-1.5" :disabled="!prefs.notifications" @click="sendTest">
      <Send class="size-3.5" />
      Send a test notification
    </Button>
  </div>
</template>
