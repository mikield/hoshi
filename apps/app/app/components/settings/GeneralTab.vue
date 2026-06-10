<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button, Input, Label, UserAvatar } from '@hoshi/ui'
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { AuthUser } from '~/composables/useAuth'

const user = useAuthUser()
const name = ref(user.value?.name ?? '')
const saving = ref(false)

watch(user, (u) => (name.value = u?.name ?? ''))

const dirty = computed(() => name.value.trim() !== (user.value?.name ?? '') && name.value.trim().length > 0)

async function save() {
  if (!dirty.value || saving.value) return
  saving.value = true
  try {
    const res = await $fetch<{ user: AuthUser }>('/api/auth/me', { method: 'PATCH', body: { name: name.value.trim() } })
    user.value = res.user
    toast.success('Profile updated')
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    toast.error(message ?? 'Failed to update profile')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-w-0 max-w-full space-y-5 overflow-x-hidden p-4 pb-12 sm:space-y-6 sm:p-6 sm:pb-6">
    <div>
      <h3 class="mb-1 text-lg font-semibold">General</h3>
      <p class="text-sm text-muted-foreground">Your profile and how you appear across the app.</p>
    </div>

    <!-- Profile picture -->
    <div class="space-y-3">
      <Label>Profile picture</Label>
      <UserAvatar v-if="user" size="xl" :email="user.email" :name="name || user.name" class="border-2 border-border" />
    </div>

    <form class="space-y-5" @submit.prevent="save">
      <div class="space-y-2">
        <Label for="settings-name">Name</Label>
        <Input id="settings-name" v-model="name" placeholder="Your name" maxlength="80" class="max-w-md shadow-none" />
      </div>
      <div class="space-y-2">
        <Label for="settings-email">Email</Label>
        <Input id="settings-email" :model-value="user?.email" disabled class="max-w-md cursor-not-allowed bg-muted/50 shadow-none" />
      </div>
      <div class="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
        <Button type="submit" :disabled="!dirty || saving" class="gap-1.5">
          <Loader2 v-if="saving" class="size-3.5 animate-spin" />
          Save changes
        </Button>
      </div>
    </form>

    <!-- Delete account (mock) -->
    <div class="space-y-4 pt-8">
      <div>
        <h4 class="mb-1 text-base font-medium">Delete account</h4>
        <p class="text-sm text-muted-foreground">Permanently remove your account and all of its data.</p>
      </div>
      <Button variant="destructive" disabled>Delete account</Button>
    </div>
  </div>
</template>
