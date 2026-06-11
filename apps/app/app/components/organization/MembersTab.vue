<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  UserAvatar,
  Skeleton,
} from '@hoshi/ui'
import { Check, Copy, Loader2, MailPlus, Search, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  fetchMembers,
  fetchInvites,
  createInvite,
  revokeInvite,
  updateMemberRole,
  removeMember,
  type OrgMember,
  type OrgInvite,
} from '~/composables/useOrganizations'

const { user } = storeToRefs(useAuthStore())
const orgs = useOrganizationsStore()

const members = ref<OrgMember[]>([])
const invites = ref<OrgInvite[]>([])
const loading = ref(true)
const query = ref('')

const org = computed(() => orgs.current)
const canManage = computed(() => org.value?.role === 'owner' || org.value?.role === 'admin')

const filteredMembers = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return members.value
  return members.value.filter(
    (m) => m.email.toLowerCase().includes(q) || m.name?.toLowerCase().includes(q),
  )
})

async function load() {
  if (!org.value) return
  loading.value = true
  try {
    ;[members.value, invites.value] = await Promise.all([
      fetchMembers(org.value.id),
      canManage.value ? fetchInvites(org.value.id) : Promise.resolve([]),
    ])
  } catch {
    toast.error('Failed to load members')
  } finally {
    loading.value = false
  }
}

watch(() => org.value?.id, load, { immediate: true })

// ── Invite dialog ────────────────────────────────────────────────────────────

const inviteOpen = ref(false)
const inviteEmail = ref('')
const inviteRole = ref<'member' | 'admin'>('member')
const inviteSubmitting = ref(false)
/** Set once the invite is created — the dialog flips to "share this link". */
const inviteUrl = ref<string | null>(null)
const copied = ref(false)

watch(inviteOpen, (open) => {
  if (!open) {
    inviteEmail.value = ''
    inviteRole.value = 'member'
    inviteSubmitting.value = false
    inviteUrl.value = null
    copied.value = false
  }
})

/** Accept links live on this web app, so build them from our own origin. */
function inviteLink(token: string): string {
  return `${window.location.origin}/invites/${token}`
}

async function submitInvite() {
  if (!org.value || inviteSubmitting.value || !inviteEmail.value.includes('@')) return
  inviteSubmitting.value = true
  try {
    const res = await createInvite(org.value.id, inviteEmail.value.trim(), inviteRole.value)
    invites.value = [res.invite, ...invites.value]
    inviteUrl.value = inviteLink(res.invite.token)
  } catch (err) {
    toast.error(apiMessage(err) ?? 'Failed to create the invite')
  } finally {
    inviteSubmitting.value = false
  }
}

async function copyInviteUrl(url: string) {
  await navigator.clipboard.writeText(url)
  copied.value = true
  toast.success('Invite link copied')
  setTimeout(() => (copied.value = false), 1500)
}

async function revoke(invite: OrgInvite) {
  if (!org.value) return
  try {
    await revokeInvite(org.value.id, invite.token)
    invites.value = invites.value.filter((i) => i.token !== invite.token)
  } catch {
    toast.error('Failed to revoke the invite')
  }
}

// ── Member management ────────────────────────────────────────────────────────

async function changeRole(member: OrgMember, role: 'admin' | 'member') {
  if (!org.value || member.role === role) return
  try {
    await updateMemberRole(org.value.id, member.user_id, role)
    members.value = members.value.map((m) => (m.user_id === member.user_id ? { ...m, role } : m))
  } catch (err) {
    toast.error(apiMessage(err) ?? 'Failed to change the role')
  }
}

async function remove(member: OrgMember) {
  if (!org.value) return
  const leavingSelf = member.user_id === user.value?.id
  try {
    await removeMember(org.value.id, member.user_id)
    if (leavingSelf) {
      await orgs.load(true)
      orgs.setCurrent(orgs.organizations[0]?.id ?? '')
      await navigateTo('/projects')
      return
    }
    members.value = members.value.filter((m) => m.user_id !== member.user_id)
  } catch (err) {
    toast.error(apiMessage(err) ?? 'Failed to remove the member')
  }
}

function apiMessage(err: unknown): string | null {
  return (err as { data?: { statusMessage?: string } })?.data?.statusMessage ?? null
}

function displayName(member: OrgMember): string {
  return member.name || member.email.split('@')[0]!
}

const ROLE_LABEL: Record<string, string> = { owner: 'Owner', admin: 'Admin', member: 'Member' }
</script>

<template>
  <OrganizationSectionCard
    title="Members"
    description="People with access to this organization."
    :count="members.length"
  >
    <template #actions>
      <Button v-if="canManage" class="gap-1.5 rounded-full" @click="inviteOpen = true">
        <MailPlus class="size-4" />
        Invite member
      </Button>
    </template>
    <template #search>
      <div class="relative max-w-xs">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="query" placeholder="Search members" class="h-9 pl-9" />
      </div>
    </template>

    <div v-if="loading" class="divide-y divide-border/40">
      <div v-for="i in 3" :key="i" class="flex items-center gap-3 px-6 py-3">
        <Skeleton class="size-8 rounded-full" />
        <div class="flex-1 space-y-1.5">
          <Skeleton class="h-4 w-32" />
          <Skeleton class="h-3 w-44" />
        </div>
        <Skeleton class="h-6 w-16 rounded-full" />
      </div>
    </div>

    <template v-else>
      <div class="divide-y divide-border/40">
        <div v-for="member in filteredMembers" :key="member.user_id" class="group flex items-center gap-3 px-6 py-3">
          <UserAvatar size="sm" :email="member.email" :name="member.name ?? undefined" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="truncate text-sm font-medium text-foreground">{{ displayName(member) }}</span>
              <Badge v-if="member.user_id === user?.id" variant="secondary">You</Badge>
            </div>
            <p class="mt-0.5 truncate text-xs text-muted-foreground">{{ member.email }}</p>
          </div>
          <div class="flex shrink-0 items-center gap-1.5">
            <Select
              v-if="canManage && member.role !== 'owner'"
              :model-value="member.role"
              @update:model-value="changeRole(member, $event as 'admin' | 'member')"
            >
              <SelectTrigger class="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
            <Badge v-else variant="outline">{{ ROLE_LABEL[member.role] }}</Badge>
            <Button
              v-if="member.role !== 'owner' && (canManage || member.user_id === user?.id)"
              variant="ghost"
              size="icon"
              class="size-8 text-muted-foreground/60 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              :title="member.user_id === user?.id ? 'Leave organization' : 'Remove member'"
              @click="remove(member)"
            >
              <Trash2 class="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Pending invites -->
      <div v-if="canManage && invites.length > 0" class="border-t border-border/60">
        <div class="px-6 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
          Pending invites
        </div>
        <div class="divide-y divide-border/40">
          <div v-for="invite in invites" :key="invite.token" class="group flex items-center gap-3 px-6 py-2.5">
            <UserAvatar size="sm" :email="invite.email" />
            <div class="min-w-0 flex-1">
              <span class="truncate text-sm text-foreground/90">{{ invite.email }}</span>
              <p class="mt-0.5 text-xs text-muted-foreground">Invited as {{ ROLE_LABEL[invite.role] }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                class="size-8 text-muted-foreground/60 hover:text-foreground"
                title="Copy invite link"
                @click="copyInviteUrl(inviteLink(invite.token))"
              >
                <Copy class="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="size-8 text-muted-foreground/60 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                title="Revoke invite"
                @click="revoke(invite)"
              >
                <Trash2 class="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </OrganizationSectionCard>

  <!-- Invite dialog -->
  <Dialog v-model:open="inviteOpen">
    <DialogContent class="gap-0 overflow-hidden p-0 sm:max-w-lg">
      <DialogHeader class="border-b border-border/60 px-6 pb-4 pt-6">
        <DialogTitle class="text-lg font-semibold tracking-tight">Invite member</DialogTitle>
        <DialogDescription class="text-sm text-muted-foreground">
          They sign in with this email and accept the link you share with them.
        </DialogDescription>
      </DialogHeader>

      <form v-if="!inviteUrl" @submit.prevent="submitInvite">
        <div class="space-y-4 px-6 py-5">
          <div class="space-y-1.5">
            <Label for="invite-email">Email address</Label>
            <Input id="invite-email" v-model="inviteEmail" type="email" placeholder="teammate@company.com" autofocus />
          </div>
          <div class="space-y-1.5">
            <Label>Role</Label>
            <Select v-model="inviteRole">
              <SelectTrigger class="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/30 px-6 py-3">
          <Button type="button" variant="ghost" :disabled="inviteSubmitting" @click="inviteOpen = false">Cancel</Button>
          <Button type="submit" class="gap-1.5" :disabled="inviteSubmitting || !inviteEmail.includes('@')">
            <Loader2 v-if="inviteSubmitting" class="size-4 animate-spin" />
            <MailPlus v-else class="size-4" />
            Create invite
          </Button>
        </div>
      </form>

      <div v-else>
        <div class="space-y-3 px-6 py-5">
          <p class="text-sm text-muted-foreground">
            Share this link with <span class="font-medium text-foreground">{{ inviteEmail }}</span> — it expires in 14 days.
          </p>
          <div class="flex items-center gap-2">
            <Input :model-value="inviteUrl" readonly class="font-mono text-xs" @focus="($event.target as HTMLInputElement).select()" />
            <Button variant="outline" size="icon" class="shrink-0" title="Copy link" @click="copyInviteUrl(inviteUrl!)">
              <Check v-if="copied" class="size-4 text-emerald-500" />
              <Copy v-else class="size-4" />
            </Button>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/30 px-6 py-3">
          <Button @click="inviteOpen = false">Done</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
