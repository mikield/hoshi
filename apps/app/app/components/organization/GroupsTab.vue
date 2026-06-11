<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Badge,
  Button,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Skeleton,
  UserAvatar,
  cn,
} from '@hoshi/ui'
import { ChevronRight, Loader2, Pencil, Plus, Search, Trash2, Users2, UserPlus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  fetchGroups,
  createGroup,
  renameGroup,
  deleteGroup,
  fetchGroupMembers,
  addGroupMember,
  removeGroupMember,
  fetchMembers,
  type OrgGroup,
  type OrgMember,
} from '~/composables/useOrganizations'

const orgs = useOrganizationsStore()
const org = computed(() => orgs.current)
const canManage = computed(() => org.value?.role === 'owner' || org.value?.role === 'admin')

const groups = ref<OrgGroup[]>([])
const loading = ref(true)
const query = ref('')

/** Expanded group + its members (one open at a time keeps the list compact). */
const openGroupId = ref<string | null>(null)
const groupMembers = ref<OrgMember[]>([])
const loadingMembers = ref(false)

/** All org members, for the add-to-group picker. */
const orgMembers = ref<OrgMember[]>([])

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? groups.value.filter((g) => g.name.toLowerCase().includes(q)) : groups.value
})

const addableMembers = computed(() =>
  orgMembers.value.filter((m) => !groupMembers.value.some((gm) => gm.user_id === m.user_id)),
)

async function load() {
  if (!org.value) return
  loading.value = true
  openGroupId.value = null
  try {
    ;[groups.value, orgMembers.value] = await Promise.all([
      fetchGroups(org.value.id),
      fetchMembers(org.value.id),
    ])
  } catch {
    toast.error('Failed to load groups')
  } finally {
    loading.value = false
  }
}

watch(() => org.value?.id, load, { immediate: true })

async function toggle(group: OrgGroup) {
  if (openGroupId.value === group.id) {
    openGroupId.value = null
    return
  }
  openGroupId.value = group.id
  loadingMembers.value = true
  groupMembers.value = []
  try {
    groupMembers.value = await fetchGroupMembers(group.id)
  } catch {
    toast.error('Failed to load group members')
  } finally {
    loadingMembers.value = false
  }
}

// ── Create / rename / delete ─────────────────────────────────────────────────

const createOpen = ref(false)
const nameInput = ref('')
const submitting = ref(false)
const renaming = ref<OrgGroup | null>(null)
const deleting = ref<OrgGroup | null>(null)

watch(createOpen, (open) => {
  if (!open) {
    nameInput.value = ''
    submitting.value = false
  }
})

async function submitCreate() {
  if (!org.value || !nameInput.value.trim() || submitting.value) return
  submitting.value = true
  try {
    const group = await createGroup(org.value.id, nameInput.value.trim())
    groups.value = [...groups.value, group]
    createOpen.value = false
  } catch {
    toast.error('Failed to create the group')
    submitting.value = false
  }
}

async function confirmRename() {
  const group = renaming.value
  if (!group || !nameInput.value.trim()) return
  try {
    const updated = await renameGroup(group.id, nameInput.value.trim())
    groups.value = groups.value.map((g) => (g.id === group.id ? { ...g, name: updated.name } : g))
  } catch {
    toast.error('Failed to rename the group')
  } finally {
    renaming.value = null
    nameInput.value = ''
  }
}

async function confirmDelete() {
  const group = deleting.value
  if (!group) return
  try {
    await deleteGroup(group.id)
    groups.value = groups.value.filter((g) => g.id !== group.id)
    if (openGroupId.value === group.id) openGroupId.value = null
  } catch {
    toast.error('Failed to delete the group')
  } finally {
    deleting.value = null
  }
}

// ── Group membership ─────────────────────────────────────────────────────────

async function addMember(userIdRaw: unknown) {
  const userId = Number(userIdRaw)
  const group = groups.value.find((g) => g.id === openGroupId.value)
  const member = orgMembers.value.find((m) => m.user_id === userId)
  if (!group || !member) return
  try {
    await addGroupMember(group.id, userId)
    groupMembers.value = [...groupMembers.value, member]
    groups.value = groups.value.map((g) => (g.id === group.id ? { ...g, member_count: g.member_count + 1 } : g))
  } catch {
    toast.error('Failed to add the member')
  }
}

async function removeMember(member: OrgMember) {
  const group = groups.value.find((g) => g.id === openGroupId.value)
  if (!group) return
  try {
    await removeGroupMember(group.id, member.user_id)
    groupMembers.value = groupMembers.value.filter((m) => m.user_id !== member.user_id)
    groups.value = groups.value.map((g) => (g.id === group.id ? { ...g, member_count: g.member_count - 1 } : g))
  } catch {
    toast.error('Failed to remove the member')
  }
}

function displayName(member: OrgMember): string {
  return member.name || member.email.split('@')[0]!
}
</script>

<template>
  <OrganizationSectionCard
    title="Groups"
    description="Bundle members together and manage them as one unit."
    :count="groups.length"
  >
    <template #actions>
      <Button v-if="canManage" class="gap-1.5 rounded-full" @click="createOpen = true">
        <Plus class="size-4" />
        Create a group
      </Button>
    </template>
    <template #search>
      <div class="relative max-w-sm">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="query" placeholder="Search groups" class="h-9 pl-9" />
      </div>
    </template>

    <div v-if="loading" class="divide-y divide-border/40">
      <div v-for="i in 2" :key="i" class="flex items-center gap-3 px-6 py-3.5">
        <Skeleton class="size-8 rounded-lg" />
        <div class="flex-1 space-y-1.5">
          <Skeleton class="h-4 w-40" />
          <Skeleton class="h-3 w-24" />
        </div>
      </div>
    </div>

    <EmptyState v-else-if="groups.length === 0" :icon="Users2" title="No groups yet" class="py-12">
      <template #description>Create a group to manage a set of members together.</template>
      <template v-if="canManage" #action>
        <Button variant="outline" class="rounded-full" @click="createOpen = true">Create a group</Button>
      </template>
    </EmptyState>

    <div v-else class="divide-y divide-border/40">
      <div v-for="group in filtered" :key="group.id">
        <!-- Group row -->
        <div
          class="group flex w-full cursor-pointer items-center gap-3 px-6 py-3.5 transition-colors hover:bg-muted/30"
          @click="toggle(group)"
        >
          <ChevronRight :class="cn('size-3.5 shrink-0 text-muted-foreground/60 transition-transform', openGroupId === group.id && 'rotate-90')" />
          <span class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
            <Users2 class="size-4 text-muted-foreground" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium text-foreground">{{ group.name }}</div>
            <p class="mt-0.5 text-xs text-muted-foreground">
              {{ group.member_count }} {{ group.member_count === 1 ? 'member' : 'members' }}
            </p>
          </div>
          <div v-if="canManage" class="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              class="size-8 text-muted-foreground/60 hover:text-foreground"
              title="Rename group"
              @click.stop="(renaming = group), (nameInput = group.name)"
            >
              <Pencil class="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="size-8 text-muted-foreground/60 hover:text-destructive"
              title="Delete group"
              @click.stop="deleting = group"
            >
              <Trash2 class="size-3.5" />
            </Button>
          </div>
        </div>

        <!-- Expanded members -->
        <div v-if="openGroupId === group.id" class="border-t border-border/40 bg-muted/[0.12] pb-3">
          <div v-if="loadingMembers" class="space-y-2 px-6 py-3 pl-14">
            <Skeleton v-for="i in 2" :key="i" class="h-8 w-2/3 rounded-lg" />
          </div>
          <template v-else>
            <div
              v-for="member in groupMembers"
              :key="member.user_id"
              class="group/member flex items-center gap-3 py-2 pl-14 pr-6"
            >
              <UserAvatar size="sm" :email="member.email" :name="member.name ?? undefined" />
              <div class="min-w-0 flex-1">
                <span class="truncate text-sm text-foreground/90">{{ displayName(member) }}</span>
                <span class="ml-2 text-xs text-muted-foreground">{{ member.email }}</span>
              </div>
              <Badge variant="outline" class="shrink-0 capitalize">{{ member.role }}</Badge>
              <Button
                v-if="canManage"
                variant="ghost"
                size="icon"
                class="size-7 shrink-0 text-muted-foreground/60 opacity-0 transition-opacity hover:text-destructive group-hover/member:opacity-100"
                title="Remove from group"
                @click="removeMember(member)"
              >
                <Trash2 class="size-3.5" />
              </Button>
            </div>
            <p v-if="groupMembers.length === 0" class="py-2 pl-14 pr-6 text-xs text-muted-foreground/70">
              Nobody in this group yet.
            </p>
            <div v-if="canManage && addableMembers.length > 0" class="flex items-center gap-2 pl-14 pr-6 pt-2">
              <UserPlus class="size-3.5 text-muted-foreground/60" />
              <Select :model-value="''" @update:model-value="addMember">
                <SelectTrigger class="h-8 w-56 text-xs"><SelectValue placeholder="Add a member…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="m in addableMembers" :key="m.user_id" :value="String(m.user_id)">
                    {{ displayName(m) }} — {{ m.email }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </template>
        </div>
      </div>
    </div>
  </OrganizationSectionCard>

  <!-- Create dialog -->
  <Dialog v-model:open="createOpen">
    <DialogContent class="gap-0 overflow-hidden p-0 sm:max-w-lg">
      <DialogHeader class="border-b border-border/60 px-6 pb-4 pt-6">
        <DialogTitle class="text-lg font-semibold tracking-tight">Create a group</DialogTitle>
        <DialogDescription class="text-sm text-muted-foreground">
          A named bundle of members you can manage together.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="submitCreate">
        <div class="space-y-1.5 px-6 py-5">
          <Label for="group-name">Group name</Label>
          <Input id="group-name" v-model="nameInput" placeholder="Engineering" maxlength="80" autofocus />
        </div>
        <div class="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/30 px-6 py-3">
          <Button type="button" variant="ghost" :disabled="submitting" @click="createOpen = false">Cancel</Button>
          <Button type="submit" class="gap-1.5" :disabled="submitting || !nameInput.trim()">
            <Loader2 v-if="submitting" class="size-4 animate-spin" />
            <Plus v-else class="size-4" />
            Create group
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>

  <!-- Rename -->
  <ConfirmDialog
    :open="renaming !== null"
    title="Rename group"
    confirm-label="Rename"
    @confirm="confirmRename"
    @update:open="(open: boolean) => { if (!open) renaming = null }"
  >
    <template #description>
      <Input v-model="nameInput" placeholder="Group name" maxlength="80" autofocus class="mt-2" @keydown.enter.prevent="confirmRename" />
    </template>
  </ConfirmDialog>

  <!-- Delete -->
  <ConfirmDialog
    :open="deleting !== null"
    title="Delete group?"
    confirm-label="Delete"
    confirm-variant="destructive"
    @confirm="confirmDelete"
    @update:open="(open: boolean) => { if (!open) deleting = null }"
  >
    <template #description>
      Removes "{{ deleting?.name }}". Its members stay in the organization.
    </template>
  </ConfirmDialog>
</template>
