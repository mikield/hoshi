<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Badge,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  UserAvatar,
} from '@hoshi/ui'
import { Users } from 'lucide-vue-next'

// Mock surface — membership has no backend yet (single-user app). The invite
// field and the member row match the real section's structure so the wiring
// can drop in later.
const user = useAuthUser()
const inviteEmail = ref('')
const inviteRole = ref('member')

const displayName = computed(() => user.value?.name || user.value?.email.split('@')[0] || 'You')
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="Users" title="Members" :count="1" />
    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div class="mx-auto w-full max-w-3xl space-y-5 px-4 py-8">
        <!-- Invite -->
        <div class="rounded-2xl border border-border/60 bg-card">
          <div class="border-b border-border/60 px-6 py-4">
            <h2 class="text-base font-semibold text-foreground">Invite people</h2>
            <p class="mt-0.5 text-xs text-muted-foreground">Give teammates access to this project.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2 px-6 py-4">
            <input
              v-model="inviteEmail"
              type="email"
              placeholder="teammate@company.com"
              class="min-w-[12rem] flex-1 rounded-2xl border border-border bg-card px-3 py-2 text-sm font-medium outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            <Select v-model="inviteRole">
              <SelectTrigger class="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button disabled>Invite</Button>
          </div>
        </div>

        <!-- Access list -->
        <div class="rounded-2xl border border-border/60 bg-card">
          <div class="border-b border-border/60 px-6 py-4">
            <h2 class="text-base font-semibold text-foreground">Project access</h2>
            <p class="mt-0.5 text-xs text-muted-foreground">People with access to this project.</p>
          </div>
          <div v-if="user" class="group flex items-center gap-3 px-6 py-3">
            <UserAvatar size="sm" :email="user.email" :name="user.name" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="truncate text-sm font-medium text-foreground">{{ displayName }}</span>
                <Badge variant="secondary">You</Badge>
              </div>
              <p class="mt-0.5 truncate text-xs text-muted-foreground">{{ user.email }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-1.5">
              <Badge variant="outline">Owner</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
