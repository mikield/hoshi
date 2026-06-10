<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  UserAvatar,
} from '@hoshi/ui'
import { Search } from 'lucide-vue-next'

// Mock surface — multi-member organizations have no backend yet. Structure
// mirrors the members list so real data can drop in unchanged.
const user = useAuthUser()
const query = ref('')
const roleFilter = ref('member')

const displayName = computed(() => user.value?.name || user.value?.email.split('@')[0] || 'You')
</script>

<template>
  <OrganizationSectionCard
    title="Members"
    description="People with access to this organization."
    :count="1"
  >
    <template #actions>
      <Button class="rounded-full" disabled>Invite member</Button>
    </template>
    <template #search>
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative max-w-xs flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input v-model="query" placeholder="Search members" class="h-9 pl-9" />
        </div>
        <Select v-model="roleFilter">
          <SelectTrigger class="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </template>
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
  </OrganizationSectionCard>
</template>
