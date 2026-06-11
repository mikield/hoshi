<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Skeleton,
  Textarea,
  cn,
} from '@hoshi/ui'
import { CircleCheck, Loader2, OctagonAlert, Wrench } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { fetchAdminStats, updateMaintenance } from '~/composables/useAdmin'

definePageMeta({ middleware: 'auth' })

const maintenance = ref<{ enabled: boolean; message: string | null } | null>(null)
const loading = ref(true)

/** The two states this instance supports — off, or a full admin-only lockdown. */
const LEVELS = [
  {
    enabled: false,
    icon: CircleCheck,
    title: 'Off',
    description: 'The instance is open — everyone can sign in and work.',
    accent: 'text-muted-foreground',
    box: 'border-border/60 bg-muted/40',
  },
  {
    enabled: true,
    icon: OctagonAlert,
    title: 'Maintenance',
    description: 'Everything is blocked for non-admins; the API answers 503 until lifted.',
    accent: 'text-red-600 dark:text-red-400',
    box: 'border-red-600/20 bg-red-600/10',
  },
] as const

const configuring = ref(false)
const pendingEnabled = ref(false)
const message = ref('')
const saving = ref(false)

const active = computed(() => LEVELS.find((level) => level.enabled === (maintenance.value?.enabled ?? false))!)

onMounted(async () => {
  try {
    maintenance.value = (await fetchAdminStats()).maintenance
  } finally {
    loading.value = false
  }
})

function pick(enabled: boolean) {
  if (enabled === maintenance.value?.enabled) return
  pendingEnabled.value = enabled
  message.value = maintenance.value?.message ?? ''
  configuring.value = true
}

async function save() {
  if (saving.value) return
  saving.value = true
  try {
    maintenance.value = await updateMaintenance(pendingEnabled.value, message.value.trim() || null)
    configuring.value = false
    toast.success(maintenance.value.enabled ? 'Maintenance mode is on' : 'Maintenance mode lifted')
  } catch {
    toast.error('Failed to update maintenance mode')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AdminShell breadcrumb="Maintenance">
    <div class="mx-auto w-full max-w-4xl space-y-6 px-6 py-6">
      <AdminSectionHeader
        :icon="Wrench"
        title="Maintenance"
        description="Take the instance offline for everyone except admins."
      >
        <template #actions>
          <Badge v-if="maintenance?.enabled" variant="destructive">Active</Badge>
        </template>
      </AdminSectionHeader>

      <Skeleton v-if="loading" class="h-40 rounded-2xl" />

      <template v-else>
        <!-- Current status summary -->
        <div v-if="maintenance?.enabled" class="rounded-2xl border border-red-600/20 bg-red-600/5 p-4">
          <div class="flex items-center gap-2 text-sm font-medium text-foreground">
            <OctagonAlert class="size-4 text-red-600 dark:text-red-400" />
            Currently active: full maintenance
          </div>
          <p v-if="maintenance.message" class="mt-1.5 text-xs text-muted-foreground">{{ maintenance.message }}</p>
        </div>

        <p class="text-sm text-muted-foreground">Select a level to configure.</p>

        <div class="grid gap-3 sm:grid-cols-2">
          <button
            v-for="level in LEVELS"
            :key="level.title"
            type="button"
            :class="cn(
              'cursor-pointer rounded-2xl bg-card p-4 text-left transition-all',
              level.enabled === (maintenance?.enabled ?? false) ? 'border-2 border-foreground/30' : 'border border-border/60 hover:border-border',
            )"
            @click="pick(level.enabled)"
          >
            <div class="flex items-start gap-3">
              <span :class="cn('flex size-10 shrink-0 items-center justify-center rounded-2xl border', level.box)">
                <component :is="level.icon" :class="cn('size-5', level.accent)" />
              </span>
              <div class="leading-tight">
                <div class="flex items-center gap-2 text-sm font-medium text-foreground">
                  {{ level.title }}
                  <Badge v-if="level.enabled === (maintenance?.enabled ?? false)" variant="secondary">Active</Badge>
                </div>
                <p class="mt-1 text-xs text-muted-foreground">{{ level.description }}</p>
              </div>
            </div>
          </button>
        </div>
      </template>
    </div>

    <!-- Config dialog -->
    <Dialog v-model:open="configuring">
      <DialogContent class="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader class="border-b border-border/60 px-6 pb-4 pt-6">
          <DialogTitle class="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <component :is="pendingEnabled ? OctagonAlert : CircleCheck" :class="cn('size-4', pendingEnabled && 'text-red-600 dark:text-red-400')" />
            {{ pendingEnabled ? 'Configure maintenance' : 'Lift maintenance' }}
          </DialogTitle>
          <DialogDescription class="text-sm text-muted-foreground">
            {{ pendingEnabled
              ? 'Non-admin requests get a 503 with your message until you switch this off.'
              : 'Saving will clear the maintenance block and let everyone back in.' }}
          </DialogDescription>
        </DialogHeader>

        <div v-if="pendingEnabled" class="space-y-1.5 px-6 py-5">
          <label for="maintenance-message" class="text-sm font-medium text-foreground">Message</label>
          <Textarea
            id="maintenance-message"
            v-model="message"
            :rows="3"
            maxlength="280"
            placeholder="We're upgrading the instance — back in ~30 minutes."
          />
        </div>
        <div v-else class="px-6 py-5 text-sm text-muted-foreground">
          The instance reopens immediately for every account.
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/30 px-6 py-3">
          <Button variant="ghost" :disabled="saving" @click="configuring = false">Cancel</Button>
          <Button :variant="pendingEnabled ? 'destructive' : 'default'" class="gap-1.5" :disabled="saving" @click="save">
            <Loader2 v-if="saving" class="size-4 animate-spin" />
            {{ pendingEnabled ? 'Enable maintenance' : 'Lift maintenance' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </AdminShell>
</template>
