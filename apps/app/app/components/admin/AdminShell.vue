<script setup lang="ts">
import { computed } from 'vue'
import { Button, cn } from '@hoshi/ui'
import { ArrowLeft, LayoutDashboard, ShieldCheck, Users, Wrench } from 'lucide-vue-next'

defineProps<{ breadcrumb?: string }>()

const route = useRoute()
const { user } = storeToRefs(useAuthStore())
const isAdmin = computed(() => user.value?.isAdmin === true)

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/accounts', label: 'Accounts', icon: Users },
  { to: '/admin/utils', label: 'Maintenance', icon: Wrench },
]

function isActive(to: string): boolean {
  return to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)
}

// Template note: the v-if/v-else pair must stay the only root nodes — pages
// root on AdminShell, and a fragment (or leading comment node) breaks page
// transitions. The denied branch mirrors Suna's in-shell access screen.
</script>

<template>
  <div v-if="!isAdmin" class="flex min-h-screen items-center justify-center bg-background px-6">
    <div class="max-w-md text-center">
      <div class="mx-auto mb-4 flex size-10 items-center justify-center rounded-2xl bg-muted/60">
        <ShieldCheck class="size-5 text-muted-foreground" />
      </div>
      <h1 class="text-lg font-semibold tracking-tight text-foreground">Admin access required</h1>
      <p class="mt-1.5 text-sm text-muted-foreground">Your account doesn't have admin permissions.</p>
      <Button variant="outline" class="mt-5 rounded-full" @click="navigateTo('/projects')">Back to projects</Button>
    </div>
  </div>

  <div v-else class="flex min-h-screen bg-background">
    <!-- Sidebar -->
    <aside class="flex w-56 shrink-0 flex-col border-r border-sidebar-border/60 bg-sidebar">
      <NuxtLink to="/admin" class="flex items-center gap-2.5 border-b border-sidebar-border/60 px-4 py-3.5">
        <span class="flex size-7 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck class="size-4 text-primary" />
        </span>
        <span class="leading-tight">
          <span class="block text-sm font-semibold tracking-tight text-foreground">Admin</span>
          <span class="block text-xs text-muted-foreground">Hoshi Console</span>
        </span>
      </NuxtLink>

      <nav class="flex-1 space-y-0.5 p-2">
        <NuxtLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          :class="cn(
            'flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors',
            isActive(item.to)
              ? 'bg-sidebar-accent text-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
          )"
        >
          <component :is="item.icon" class="size-4" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="border-t border-sidebar-border/60 p-2">
        <NuxtLink
          to="/projects"
          title="Leave admin console"
          class="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
        >
          <ArrowLeft class="size-4" />
          Back to App
        </NuxtLink>
      </div>
    </aside>

    <!-- Content -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-border/60 bg-background/80 px-3 text-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <NuxtLink to="/admin" class="text-muted-foreground transition-colors hover:text-foreground">Admin</NuxtLink>
        <template v-if="breadcrumb">
          <span class="text-muted-foreground/40">/</span>
          <span class="font-medium capitalize">{{ breadcrumb }}</span>
        </template>
      </header>
      <main class="min-h-0 flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
