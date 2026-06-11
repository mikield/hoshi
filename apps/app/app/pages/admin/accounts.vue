<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Badge,
  Button,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  EmptyState,
  Input,
  Skeleton,
  StatPill,
  UserAvatar,
  EntityAvatar,
  cn,
} from '@hoshi/ui'
import { Ban, CircleCheck, MoreHorizontal, RefreshCw, Search, ShieldCheck, ShieldOff, Trash2, Users, Inbox } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  fetchAdminUsers,
  fetchAdminOrgs,
  patchAdminUser,
  deleteAdminUser,
  type AdminUser,
  type AdminOrg,
} from '~/composables/useAdmin'

definePageMeta({ middleware: 'auth' })

const { user: me } = storeToRefs(useAuthStore())

const users = ref<AdminUser[]>([])
const orgs = ref<AdminOrg[]>([])
const loading = ref(true)
const fetching = ref(false)
const query = ref('')
const deleting = ref<AdminUser | null>(null)

const admins = computed(() => users.value.filter((u) => u.is_admin).length)
const disabledCount = computed(() => users.value.filter((u) => u.disabled).length)

async function load() {
  fetching.value = true
  try {
    ;[users.value, orgs.value] = await Promise.all([fetchAdminUsers(query.value || undefined), fetchAdminOrgs()])
  } catch {
    toast.error('Failed to load accounts')
  } finally {
    loading.value = false
    fetching.value = false
  }
}

onMounted(load)

let debounce: ReturnType<typeof setTimeout> | null = null
watch(query, () => {
  if (debounce) clearTimeout(debounce)
  debounce = setTimeout(load, 300)
})

function apiMessage(err: unknown): string | null {
  return (err as { data?: { statusMessage?: string } })?.data?.statusMessage ?? null
}

async function toggleDisabled(target: AdminUser) {
  try {
    const updated = await patchAdminUser(target.id, { disabled: !target.disabled })
    users.value = users.value.map((u) => (u.id === target.id ? { ...u, ...updated } : u))
    toast.success(updated.disabled ? 'Account disabled' : 'Account enabled')
  } catch (err) {
    toast.error(apiMessage(err) ?? 'Failed to update the account')
  }
}

async function toggleAdmin(target: AdminUser) {
  try {
    const updated = await patchAdminUser(target.id, { isAdmin: !target.is_admin })
    users.value = users.value.map((u) => (u.id === target.id ? { ...u, ...updated } : u))
    toast.success(updated.is_admin ? 'Admin granted' : 'Admin revoked')
  } catch (err) {
    toast.error(apiMessage(err) ?? 'Failed to update the account')
  }
}

async function confirmDelete() {
  const target = deleting.value
  if (!target) return
  try {
    await deleteAdminUser(target.id)
    users.value = users.value.filter((u) => u.id !== target.id)
    toast.success('Account deleted')
  } catch (err) {
    toast.error(apiMessage(err) ?? 'Failed to delete the account')
  } finally {
    deleting.value = null
  }
}

function formatDate(value: string): string {
  return new Date(`${value.replace(' ', 'T')}Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <AdminShell breadcrumb="Accounts">
    <div class="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <AdminSectionHeader :icon="Users" title="Accounts" description="Every user and organization on this instance.">
        <template #actions>
          <Button variant="outline" class="gap-1.5 rounded-full" :disabled="fetching" @click="load">
            <RefreshCw :class="cn('size-3.5', fetching && 'animate-spin')" />
            Refresh
          </Button>
        </template>
      </AdminSectionHeader>

      <div v-if="loading" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton v-for="i in 4" :key="i" class="h-24 rounded-2xl" />
      </div>
      <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Total" :value="users.length.toLocaleString()" :hint="query ? 'Matches current search' : 'All accounts'" />
        <StatPill label="Admins" :value="admins" tone="success" hint="Instance administrators" />
        <StatPill label="Disabled" :value="disabledCount" :tone="disabledCount > 0 ? 'warning' : 'success'" :hint="disabledCount > 0 ? 'Locked out' : 'All clear'" />
        <StatPill label="Organizations" :value="orgs.length" hint="Across the instance" />
      </div>

      <div class="relative max-w-md">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="query" placeholder="Search by email or name" class="h-9 pl-9" />
      </div>

      <!-- Users table -->
      <div v-if="loading">
        <Skeleton class="h-64 rounded-2xl" />
      </div>
      <div v-else-if="users.length === 0" class="rounded-2xl border border-border/60 bg-card">
        <EmptyState :icon="Inbox" :title="query ? 'No accounts match your search' : 'No accounts yet'" class="py-12" />
      </div>
      <div v-else :class="cn('overflow-hidden rounded-2xl border border-border/60 transition-opacity', fetching && 'opacity-70')">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border/60 bg-muted/30 text-left text-xs text-muted-foreground">
              <th class="px-4 py-2.5 font-medium">Account</th>
              <th class="px-4 py-2.5 text-right font-medium">Orgs</th>
              <th class="px-4 py-2.5 text-right font-medium">Projects</th>
              <th class="px-4 py-2.5 font-medium">Role</th>
              <th class="px-4 py-2.5 font-medium">Status</th>
              <th class="px-4 py-2.5 font-medium">Created</th>
              <th class="w-12 px-2 py-2.5" />
            </tr>
          </thead>
          <tbody class="divide-y divide-border/40">
            <tr v-for="account in users" :key="account.id" class="bg-card transition-colors hover:bg-muted/20">
              <td class="max-w-[320px] px-4 py-3">
                <div class="flex items-center gap-3">
                  <UserAvatar size="sm" :email="account.email" :name="account.name ?? undefined" />
                  <div class="min-w-0 leading-tight">
                    <div class="truncate text-sm font-medium text-foreground">
                      {{ account.name || account.email.split('@')[0] }}
                      <span v-if="account.id === me?.id" class="ml-1 text-xs text-muted-foreground">(you)</span>
                    </div>
                    <div class="truncate text-xs text-muted-foreground">{{ account.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-right tabular-nums">{{ account.org_count }}</td>
              <td class="px-4 py-3 text-right tabular-nums">{{ account.project_count }}</td>
              <td class="px-4 py-3">
                <Badge :variant="account.is_admin ? 'default' : 'secondary'">{{ account.is_admin ? 'Admin' : 'User' }}</Badge>
              </td>
              <td class="px-4 py-3">
                <Badge :variant="account.disabled ? 'destructive' : 'outline'">{{ account.disabled ? 'Disabled' : 'Active' }}</Badge>
              </td>
              <td class="px-4 py-3 text-xs text-muted-foreground">{{ formatDate(account.created_at) }}</td>
              <td class="px-2 py-3">
                <DropdownMenu v-if="account.id !== me?.id">
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="size-8 text-muted-foreground/60 hover:text-foreground">
                      <MoreHorizontal class="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-48">
                    <DropdownMenuItem class="gap-2" @select="toggleAdmin(account)">
                      <component :is="account.is_admin ? ShieldOff : ShieldCheck" class="size-3.5" />
                      {{ account.is_admin ? 'Revoke admin' : 'Make admin' }}
                    </DropdownMenuItem>
                    <DropdownMenuItem class="gap-2" @select="toggleDisabled(account)">
                      <component :is="account.disabled ? CircleCheck : Ban" class="size-3.5" />
                      {{ account.disabled ? 'Enable account' : 'Disable account' }}
                    </DropdownMenuItem>
                    <DropdownMenuItem class="gap-2 text-destructive focus:text-destructive" @select="deleting = account">
                      <Trash2 class="size-3.5" />
                      Delete account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Organizations table -->
      <div v-if="!loading && orgs.length > 0" class="overflow-hidden rounded-2xl border border-border/60">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border/60 bg-muted/30 text-left text-xs text-muted-foreground">
              <th class="px-4 py-2.5 font-medium">Organization</th>
              <th class="px-4 py-2.5 text-right font-medium">Members</th>
              <th class="px-4 py-2.5 text-right font-medium">Projects</th>
              <th class="px-4 py-2.5 font-medium">Created</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/40">
            <tr v-for="org in orgs" :key="org.id" class="bg-card transition-colors hover:bg-muted/20">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <EntityAvatar :label="org.name" size="sm" />
                  <span class="truncate text-sm font-medium text-foreground">{{ org.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right tabular-nums">{{ org.member_count }}</td>
              <td class="px-4 py-3 text-right tabular-nums">{{ org.project_count }}</td>
              <td class="px-4 py-3 text-xs text-muted-foreground">{{ formatDate(org.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmDialog
      :open="deleting !== null"
      title="Delete this account?"
      confirm-label="Delete account"
      confirm-variant="destructive"
      @confirm="confirmDelete"
      @update:open="(open: boolean) => { if (!open) deleting = null }"
    >
      <template #description>
        Permanently removes {{ deleting?.email }}, their memberships, and the projects they created. This cannot be undone.
      </template>
    </ConfirmDialog>
  </AdminShell>
</template>
