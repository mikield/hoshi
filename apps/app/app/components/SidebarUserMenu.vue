<script setup lang="ts">
import { computed } from 'vue'
import {
  UserAvatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  cn,
} from '@hoshi/ui'
import { ChevronsUpDown, Home, LogOut, Settings } from 'lucide-vue-next'
import type { AuthUser } from '~/composables/useAuth'
import { logout } from '~/composables/useAuth'

const props = defineProps<{
  user: AuthUser
  collapsed?: boolean
}>()

const displayName = computed(() => props.user.name || props.user.email.split('@')[0])
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        :class="cn(
          'flex w-full cursor-pointer items-center gap-2 rounded-2xl border border-transparent bg-transparent px-1.5 py-1 text-left transition-colors',
          'hover:bg-sidebar-accent/60 data-[state=open]:bg-sidebar-accent',
          collapsed && 'justify-center gap-0 px-0',
        )"
      >
        <UserAvatar size="sm" :email="user.email" :name="user.name" class="ring-1 ring-border/40" />
        <template v-if="!collapsed">
          <div class="grid min-w-0 flex-1 text-left leading-tight">
            <span class="truncate text-sm font-medium tracking-tight text-foreground">{{ displayName }}</span>
            <span class="mt-0.5 truncate text-xs text-muted-foreground/80">{{ user.email }}</span>
          </div>
          <ChevronsUpDown class="ml-auto size-3 shrink-0 text-muted-foreground/30" />
        </template>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" side="top" :side-offset="6" class="w-[256px] overflow-hidden rounded-2xl border-border/60 p-0">
      <div class="flex items-center gap-2.5 px-3 pt-3 pb-2.5">
        <UserAvatar size="md" :email="user.email" :name="user.name" />
        <div class="min-w-0 flex-1 leading-tight">
          <div class="truncate text-sm font-medium text-foreground">{{ displayName }}</div>
          <div class="mt-0.5 truncate text-xs text-muted-foreground/80">{{ user.email }}</div>
        </div>
      </div>
      <div class="h-px bg-border/40" />
      <div class="p-1">
        <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-0 text-left [&_svg]:!text-muted-foreground/70" @select="navigateTo('/projects')">
          <Home class="size-3.5" />
          <span class="flex-1 truncate text-sm font-medium leading-tight">Home</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-0 text-left [&_svg]:!text-muted-foreground/70">
          <Settings class="size-3.5" />
          <span class="flex-1 truncate text-sm font-medium leading-tight">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-0 text-left [&_svg]:!text-muted-foreground/70" @select="logout">
          <LogOut class="size-3.5" />
          <span class="flex-1 truncate text-sm font-medium leading-tight">Sign out</span>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
