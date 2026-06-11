<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button, ConfirmDialog, Input, Label } from '@hoshi/ui'
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const orgs = useOrganizationsStore()
const org = computed(() => orgs.current)

const name = ref(org.value?.name ?? '')
watch(() => org.value?.name, (value) => (name.value = value ?? ''))

const canManage = computed(() => org.value?.role === 'owner' || org.value?.role === 'admin')
const isOwner = computed(() => org.value?.role === 'owner')
const isOnlyOrg = computed(() => orgs.organizations.length <= 1)
const dirty = computed(() => name.value.trim() !== org.value?.name && name.value.trim().length > 0)

const saving = ref(false)
const confirmingDelete = ref(false)
const deleting = ref(false)

async function save() {
  if (!org.value || !dirty.value || saving.value) return
  saving.value = true
  try {
    await orgs.rename(org.value.id, name.value.trim())
    toast.success('Organization renamed')
  } catch {
    toast.error('Failed to rename the organization')
  } finally {
    saving.value = false
  }
}

async function destroy() {
  if (!org.value || deleting.value) return
  deleting.value = true
  try {
    await orgs.remove(org.value.id)
    confirmingDelete.value = false
    toast.success('Organization deleted')
    await navigateTo('/projects')
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    toast.error(message ?? 'Failed to delete the organization')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- General -->
    <div class="space-y-3">
      <div class="space-y-0.5 px-1">
        <h3 class="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">General</h3>
        <p class="text-[11px] text-muted-foreground/80">Basic information about this organization.</p>
      </div>
      <div class="rounded-2xl border border-border/60 bg-card">
        <div class="space-y-4 px-6 py-5">
          <div class="space-y-1.5">
            <Label for="org-name">Organization name</Label>
            <Input id="org-name" v-model="name" maxlength="120" class="max-w-md" :disabled="!canManage" />
          </div>
          <div class="flex items-center justify-between border-t border-border/60 pt-4">
            <span class="text-xs text-muted-foreground">Shown in the header breadcrumb.</span>
            <Button size="sm" class="gap-1.5" :disabled="!canManage || !dirty || saving" @click="save">
              <Loader2 v-if="saving" class="size-3.5 animate-spin" />
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Danger zone -->
    <div v-if="isOwner" class="space-y-3">
      <div class="space-y-0.5 px-1">
        <h3 class="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">Danger zone</h3>
        <p class="text-[11px] text-muted-foreground/80">Irreversible actions for this organization.</p>
      </div>
      <div class="rounded-2xl border border-destructive/30 bg-card">
        <div class="flex items-center justify-between gap-4 px-6 py-5">
          <div class="leading-tight">
            <div class="text-sm font-medium text-foreground">Delete organization</div>
            <p class="mt-0.5 text-xs text-muted-foreground">
              {{ isOnlyOrg ? "You can't delete your only organization." : 'Removes the organization, its projects, and member access.' }}
            </p>
          </div>
          <Button variant="destructive" size="sm" class="shrink-0" :disabled="isOnlyOrg" @click="confirmingDelete = true">
            Delete
          </Button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-model:open="confirmingDelete"
      :title="`Delete ${org?.name}?`"
      confirm-label="Delete organization"
      confirm-variant="destructive"
      :is-pending="deleting"
      @confirm="destroy"
    >
      <template #description>
        This permanently removes the organization, all of its projects, and every member's access.
      </template>
    </ConfirmDialog>
  </div>
</template>
