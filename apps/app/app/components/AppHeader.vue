<script setup lang="ts">
import {
  Logo,
  UserAvatar,
  EntityAvatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Skeleton,
} from '@hoshi/ui'
import { LogOut, Settings, ChevronsUpDown, Plus, Check, CreditCard, ShieldCheck } from 'lucide-vue-next'
import type { AuthUser } from '~/stores/auth'

const props = withDefaults(
  defineProps<{
    user: AuthUser
    breadcrumb?: string
    logoHref?: string
  }>(),
  { logoHref: '/projects' },
)

const displayName = computed(() => props.user.name || props.user.email.split('@')[0])
const { show: showSettings } = useSettingsModal()
const { logout } = useAuthStore()

const orgs = useOrganizationsStore()
const creatingOrg = ref(false)
onMounted(() => orgs.load())

function switchOrg(id: string) {
  orgs.setCurrent(id)
  navigateTo('/projects')
}
</script>

<template>
  <OrganizationCreateModal v-model:open="creatingOrg" />
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
      <div v-if="!orgs.current" class="flex h-8 items-center gap-2 px-2">
        <Skeleton class="size-5 rounded-[5px]" />
        <Skeleton class="h-4 w-36 rounded-md" />
      </div>
      <DropdownMenu v-else>
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            aria-label="Switch organization"
            class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 text-foreground transition-colors hover:bg-muted/50 data-[state=open]:bg-muted/60"
          >
            <EntityAvatar :label="orgs.current.name" size="xs" />
            <span class="max-w-40 truncate text-sm font-medium">{{ orgs.current.name }}</span>
            <ChevronsUpDown class="h-3 w-3 text-muted-foreground/50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom" :side-offset="6" class="w-64 overflow-hidden rounded-2xl border-border/60 p-0">
          <div class="py-1.5">
            <div class="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground/50">
              Organization
            </div>
            <div class="max-h-70 overflow-y-auto px-1">
              <DropdownMenuItem
                v-for="org in orgs.organizations"
                :key="org.id"
                :class="['flex h-9 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-0', org.id === orgs.current?.id && 'bg-muted/60']"
                @select="switchOrg(org.id)"
              >
                <EntityAvatar :label="org.name" size="xs" />
                <span class="min-w-0 flex-1 truncate text-sm font-medium leading-tight">{{ org.name }}</span>
                <Check v-if="org.id === orgs.current?.id" class="size-3.5 shrink-0 text-foreground/70" />
              </DropdownMenuItem>
            </div>
          </div>
          <div class="h-px bg-border/40" />
          <div class="px-1 py-1">
            <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-0 [&_svg]:text-muted-foreground/70!" @select="navigateTo('/organization')">
              <Settings class="size-3.5" />
              <span class="flex-1 truncate text-sm font-medium text-foreground/80">Organization settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-0 [&_svg]:text-muted-foreground/70!" @select="creatingOrg = true">
              <Plus class="size-3.5" />
              <span class="flex-1 truncate text-sm font-medium text-foreground/80">New organization</span>
            </DropdownMenuItem>
            <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-0 [&_svg]:text-muted-foreground/70!" @select="navigateTo('/organization?tab=billing')">
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
            <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-0 text-left [&_svg]:text-muted-foreground/70!" @select="showSettings">
              <Settings class="size-3.5" />
              <span class="flex-1 truncate text-sm font-medium leading-tight">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem v-if="user.isAdmin" class="flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-0 text-left [&_svg]:text-muted-foreground/70!" @select="navigateTo('/admin')">
              <ShieldCheck class="size-3.5" />
              <span class="flex-1 truncate text-sm font-medium leading-tight">Admin console</span>
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
