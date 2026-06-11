<script setup lang="ts">
import { ref, computed } from 'vue'
import { Skeleton, StatPill } from '@hoshi/ui'
import { ArrowRight, LayoutDashboard, Users, Wrench } from 'lucide-vue-next'
import { fetchAdminStats, type AdminStats } from '~/composables/useAdmin'

definePageMeta({ middleware: 'auth' })

const stats = ref<AdminStats | null>(null)
const loading = ref(true)

const uptime = computed(() => {
  const s = stats.value?.uptimeSeconds ?? 0
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
  return `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h`
})

const QUICK_LINKS = [
  { to: '/admin/accounts', icon: Users, title: 'Accounts', description: 'Inspect every user and organization on this instance.' },
  { to: '/admin/utils', icon: Wrench, title: 'Maintenance', description: 'Take the instance offline for everyone except admins.' },
]

onMounted(async () => {
  try {
    stats.value = await fetchAdminStats()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AdminShell>
    <div class="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <AdminSectionHeader
        :icon="LayoutDashboard"
        title="Admin Overview"
        description="Health and headcount of this Hoshi instance at a glance."
      />

      <div v-if="loading" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton v-for="i in 4" :key="i" class="h-24 rounded-2xl" />
      </div>
      <div v-else-if="stats" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill
          label="API"
          :value="stats.maintenance.enabled ? 'MAINTENANCE' : 'OK'"
          :hint="`up ${uptime}`"
          :tone="stats.maintenance.enabled ? 'warning' : 'success'"
        />
        <StatPill label="Users" :value="stats.counts.users.toLocaleString()" :hint="`${stats.counts.organizations} organizations`" />
        <StatPill label="Projects" :value="stats.counts.projects.toLocaleString()" :hint="`${stats.counts.sessions} linked sessions`" />
        <StatPill
          label="OpenCode"
          :value="stats.opencode.reachable ? 'REACHABLE' : 'OFFLINE'"
          :hint="stats.opencode.version ? `v${stats.opencode.version}` : stats.opencode.url"
          :tone="stats.opencode.reachable ? 'success' : 'danger'"
        />
      </div>

      <div class="grid gap-3 md:grid-cols-2">
        <NuxtLink
          v-for="link in QUICK_LINKS"
          :key="link.to"
          :to="link.to"
          class="group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-border hover:bg-muted/30"
        >
          <div class="flex items-center justify-between">
            <span class="flex size-9 items-center justify-center rounded-2xl border border-border/60 bg-muted/40">
              <component :is="link.icon" class="size-4 text-muted-foreground" />
            </span>
            <ArrowRight class="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div class="leading-tight">
            <div class="text-sm font-medium text-foreground">{{ link.title }}</div>
            <p class="mt-0.5 text-xs text-muted-foreground">{{ link.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </AdminShell>
</template>
