<script setup lang="ts">
import {
  Button,
  UserAvatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@hoshi/ui'
import { LogOut, Settings, ChevronsUpDown, Plus, Check, ArrowUpRight, CreditCard } from 'lucide-vue-next'
import type { AuthUser } from '~/composables/useAuth'
import { logout } from '~/composables/useAuth'

const props = withDefaults(
  defineProps<{
    user: AuthUser
    breadcrumb?: string
    logoHref?: string
  }>(),
  { logoHref: '/projects' },
)

const displayName = computed(() => props.user.name || props.user.email.split('@')[0])
const accountName = computed(() => `${props.user.email}'s Account`)
const accountInitial = computed(() => displayName.value.charAt(0).toUpperCase())
</script>

<template>
  <header class="kx-app-header flex shrink-0 items-center justify-between gap-3 border-b border-border/60 px-6 py-4">
    <div class="flex min-w-0 items-center gap-1">
      <NuxtLink
        :to="logoHref"
        aria-label="OpenCode home"
        class="mr-1 inline-flex cursor-pointer items-center rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span class="flex size-6 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">K</span>
      </NuxtLink>
      <span aria-hidden="true" class="select-none px-0.5 text-sm font-light text-muted-foreground/40 transform -skew-x-12">/</span>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            class="inline-flex cursor-pointer select-none items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
          >
            <span class="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground text-[10px] font-semibold text-background">{{ accountInitial }}</span>
            <span class="max-w-[200px] truncate">{{ accountName }}</span>
            <ChevronsUpDown class="size-3.5 shrink-0 text-muted-foreground/60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" class="w-72">
          <DropdownMenuLabel class="text-xs font-normal text-muted-foreground">Account</DropdownMenuLabel>
          <DropdownMenuItem class="gap-2">
            <span class="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground text-[10px] font-semibold text-background">{{ accountInitial }}</span>
            <span class="truncate">{{ accountName }}</span>
            <Check class="ml-auto size-3.5 shrink-0 text-foreground" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 text-muted-foreground focus:text-foreground">
            <Settings class="size-3.5" />
            Account settings
          </DropdownMenuItem>
          <DropdownMenuItem class="gap-2 text-muted-foreground focus:text-foreground">
            <ArrowUpRight class="size-3.5" />
            All accounts
          </DropdownMenuItem>
          <DropdownMenuItem class="gap-2 text-muted-foreground focus:text-foreground">
            <Plus class="size-3.5" />
            New account
          </DropdownMenuItem>
          <DropdownMenuItem class="gap-2 text-muted-foreground focus:text-foreground">
            <CreditCard class="size-3.5" />
            Billing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <template v-if="breadcrumb != null || $slots.breadcrumb">
        <span aria-hidden="true" class="select-none px-0.5 text-sm font-light text-muted-foreground/40 transform -skew-x-12">/</span>
        <span class="select-none px-2 text-sm font-medium text-foreground">
          <slot name="breadcrumb">{{ breadcrumb }}</slot>
        </span>
      </template>
    </div>
    <div class="flex items-center gap-2">
      <slot name="actions" />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            class="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-sm transition-colors hover:bg-muted/60"
          >
            <UserAvatar size="sm" :email="user.email" :name="user.name" />
            <span class="hidden max-w-[140px] truncate text-foreground sm:inline">{{ displayName }}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <div class="px-2 py-1.5">
            <div class="truncate text-sm font-medium text-foreground">{{ displayName }}</div>
            <div class="truncate text-xs text-muted-foreground">{{ user.email }}</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2">
            <Settings class="size-3.5" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 text-muted-foreground focus:text-foreground" @select="logout">
            <LogOut class="size-3.5" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
