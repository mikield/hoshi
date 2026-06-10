<script setup lang="ts">
import {
  Logo,
  UserAvatar,
  EntityAvatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
</script>

<template>
  <header class="kx-app-header flex shrink-0 items-center justify-between gap-3 px-6 py-4">
    <div class="flex min-w-0 items-center gap-1">
      <NuxtLink
        :to="logoHref"
        aria-label="Hoshi home"
        class="mr-1 inline-flex cursor-pointer items-center rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Logo variant="logo" class="h-4 w-auto" />
      </NuxtLink>
      <span aria-hidden="true" class="select-none px-0.5 text-sm font-light text-muted-foreground/40 transform -skew-x-12">/</span>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            aria-label="Switch account"
            class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 text-foreground transition-colors hover:bg-muted/50 data-[state=open]:bg-muted/60"
          >
            <EntityAvatar :label="accountName" size="xs" />
            <span class="max-w-40 truncate text-sm font-medium">{{ accountName }}</span>
            <ChevronsUpDown class="h-3 w-3 text-muted-foreground/50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom" :side-offset="6" class="w-64 overflow-hidden rounded-2xl border-border/60 p-0">
          <div class="py-1.5">
            <div class="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground/50">
              Account
            </div>
            <div class="max-h-70 overflow-y-auto px-1">
              <DropdownMenuItem class="flex h-9 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-0 bg-muted/60">
                <EntityAvatar :label="accountName" size="xs" />
                <span class="min-w-0 flex-1 truncate text-sm font-medium leading-tight">{{ accountName }}</span>
                <Check class="size-3.5 shrink-0 text-foreground/70" />
              </DropdownMenuItem>
            </div>
          </div>
          <div class="h-px bg-border/40" />
          <div class="px-1 py-1">
            <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-0 [&_svg]:text-muted-foreground/70!">
              <Settings class="size-3.5" />
              <span class="flex-1 truncate text-sm font-medium text-foreground/80">Account settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-0 [&_svg]:text-muted-foreground/70!">
              <ArrowUpRight class="size-3.5" />
              <span class="flex-1 truncate text-sm font-medium text-foreground/80">All accounts</span>
            </DropdownMenuItem>
            <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-0 [&_svg]:text-muted-foreground/70!">
              <Plus class="size-3.5" />
              <span class="flex-1 truncate text-sm font-medium text-foreground/80">New account</span>
            </DropdownMenuItem>
            <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-0 [&_svg]:text-muted-foreground/70!">
              <CreditCard class="size-3.5" />
              <span class="flex-1 truncate text-sm font-medium text-foreground/80">Billing</span>
            </DropdownMenuItem>
          </div>
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
            aria-label="Your menu"
            class="flex h-8 cursor-pointer items-center gap-2 rounded-xl border border-border/50 bg-transparent pl-1 pr-2 transition-colors hover:bg-muted/40 data-[state=open]:bg-muted/50"
          >
            <UserAvatar size="sm" :email="user.email" :name="user.name" />
            <span class="text-sm font-medium leading-tight">{{user.name}}</span>
            <ChevronsUpDown class="size-3 text-muted-foreground/60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" :side-offset="8" class="w-[256px] overflow-hidden border-border/60 p-0">
          <div class="flex items-center gap-2.5 px-3 pt-3 pb-2.5">
            <UserAvatar size="md" :email="user.email" :name="user.name" />
            <div class="min-w-0 flex-1 leading-tight">
              <div class="truncate text-sm font-medium text-foreground">{{ displayName }}</div>
              <div class="mt-0.5 truncate text-xs text-muted-foreground/80">{{ user.email }}</div>
            </div>
          </div>
          <div class="h-px bg-border/40" />
          <div class="p-1">
            <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-0 text-left [&_svg]:text-muted-foreground/70!">
              <Settings class="size-3.5" />
              <span class="flex-1 truncate text-sm font-medium leading-tight">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-0 text-left [&_svg]:text-muted-foreground/70!" @select="logout">
              <LogOut class="size-3.5" />
              <span class="flex-1 truncate text-sm font-medium leading-tight">Sign out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
