<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Logo,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Skeleton,
  cn,
} from '@hoshi/ui'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListTree,
  Loader2,
  MoreHorizontal,
  SlidersHorizontal,
  SquarePen,
  Trash2,
} from 'lucide-vue-next'
import type { SessionInfo } from '~/composables/useOpencode'
import { shortRelative } from '~/composables/useProjects'

const props = defineProps<{
  projectId: string
  sessions: SessionInfo[]
  activeSessionId: string | null
  loading: boolean
  creating?: boolean
}>()

const emit = defineEmits<{ select: [id: string]; create: []; delete: [id: string] }>()

const { user } = storeToRefs(useAuthStore())
const { show: showCustomize } = useCustomize()
const { now } = storeToRefs(useProjectsStore())
const collapsed = useState('sidebar:collapsed', () => false)
const sessionsOpen = ref(true)
const hoveredId = ref<string | null>(null)
const menuId = ref<string | null>(null)

// Resolved on mount so SSR and the first client render agree (avoids a
// hydration mismatch between "Ctrl" and "⌘").
const modSymbol = ref('⌘')

const rootSessions = computed(() => props.sessions.filter((s) => !s.parentID))

onMounted(() => {
  if (!/Mac|iPod|iPhone|iPad/.test(navigator.platform)) modSymbol.value = 'Ctrl'
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && (e.key === 'j' || e.key === 'J')) {
    e.preventDefault()
    emit('create')
  }
}
</script>

<template>
  <div
    :class="cn(
      'flex h-full shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out',
      collapsed ? 'w-13' : 'w-70',
    )"
  >
    <!-- Header — logo + collapse toggle, project switcher pinned below -->
    <div class="flex flex-col gap-2 px-2 pb-1 pt-3">
      <div class="relative flex h-7 shrink-0 items-center justify-between px-2" :class="collapsed && 'justify-center px-0'">
        <NuxtLink v-if="!collapsed" to="/projects" class="flex items-center" aria-label="Projects">
          <Logo variant="logo" class="h-4 w-auto shrink-0" />
        </NuxtLink>
        <button
          v-if="collapsed"
          type="button"
          class="group/collapsed absolute inset-0 flex cursor-pointer items-center justify-center"
          aria-label="Expand sidebar"
          @click="collapsed = false"
        >
          <span class="flex items-center justify-center group-hover/collapsed:hidden">
            <Logo variant="symbol" class="h-5 w-5 shrink-0" />
          </span>
          <ChevronRight class="hidden h-3.5 w-3.5 text-sidebar-foreground group-hover/collapsed:block" />
        </button>
        <button
          v-if="!collapsed"
          type="button"
          aria-label="Collapse sidebar"
          class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          @click="collapsed = true"
        >
          <ChevronLeft class="h-3.5 w-3.5" />
        </button>
      </div>
      <div class="pt-2">
        <ProjectSwitcherSidebar :project-id="projectId" :collapsed="collapsed" />
      </div>
    </div>

    <!-- Content -->
    <div class="relative min-h-0 flex-1 overflow-visible">
      <!-- Collapsed: icon rail -->
      <div v-if="collapsed" class="absolute inset-0 flex flex-col items-center px-2 pb-1 pt-1">
        <div class="w-full space-y-0.5">
          <button
            type="button"
            :disabled="creating"
            class="flex w-full cursor-pointer items-center justify-center rounded-lg py-2 text-sidebar-foreground transition-colors duration-150 ease-out hover:bg-sidebar-accent disabled:cursor-not-allowed disabled:opacity-50"
            title="New session"
            @click="emit('create')"
          >
            <Loader2 v-if="creating" class="h-4 w-4 animate-spin" />
            <SquarePen v-else class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-center rounded-lg py-2 text-sidebar-foreground transition-colors duration-150 ease-out hover:bg-sidebar-accent"
            title="Sessions"
            @click="collapsed = false"
          >
            <ListTree class="h-4 w-4" />
          </button>
        </div>
        <!-- Customize pinned to the bottom of the rail -->
        <div class="mt-auto w-full space-y-0.5">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-center rounded-lg py-2 text-sidebar-foreground transition-colors duration-150 ease-out hover:bg-sidebar-accent"
            title="Customize"
            @click="showCustomize()"
          >
            <SlidersHorizontal class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Expanded layout -->
      <div v-else class="flex h-full min-h-0 flex-col gap-0 px-2">
        <!-- Primary action -->
        <button
          type="button"
          :disabled="creating"
          class="group/menu-button flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-lg p-2 text-left text-sm font-normal text-sidebar-foreground outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
          @click="emit('create')"
        >
          <Loader2 v-if="creating" class="animate-spin" />
          <SquarePen v-else />
          <span>{{ creating ? 'Creating…' : 'New session' }}</span>
          <span class="ml-auto flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover/menu-button:opacity-100">
            <kbd class="inline-flex h-5 min-w-5 select-none items-center justify-center rounded border border-border/40 bg-foreground/5 px-1 text-xs font-medium leading-none text-muted-foreground/70">{{ modSymbol }}</kbd>
            <kbd class="inline-flex h-5 min-w-5 select-none items-center justify-center rounded border border-border/40 bg-foreground/5 px-1 text-xs font-medium leading-none text-muted-foreground/70">J</kbd>
          </span>
        </button>

        <!-- Sessions -->
        <div class="flex min-h-0 flex-1 flex-col">
          <button
            type="button"
            class="mt-1 flex h-6 shrink-0 cursor-pointer items-center gap-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60 hover:text-sidebar-foreground"
            @click="sessionsOpen = !sessionsOpen"
          >
            <span class="flex-1 text-left">Sessions</span>
            <ChevronDown :class="cn('size-3 transition-transform duration-200', !sessionsOpen && '-rotate-90')" />
          </button>
          <div
            v-if="sessionsOpen"
            class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
          >
            <div v-if="loading" class="space-y-1">
              <Skeleton v-for="i in 4" :key="i" class="h-8 rounded-lg" />
            </div>
            <div v-else-if="rootSessions.length === 0" class="px-2 pb-2 pt-1 text-xs text-muted-foreground/60">
              No sessions yet.
            </div>
            <div v-else class="space-y-px">
              <div
                v-for="s in rootSessions"
                :key="s.id"
                :class="cn(
                  'relative flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 transition-colors duration-150',
                  s.id === activeSessionId
                    ? 'bg-sidebar-accent font-medium text-sidebar-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                )"
                @mouseenter="hoveredId = s.id"
                @mouseleave="hoveredId = null"
                @click="emit('select', s.id)"
              >
                <span
                  v-if="s.id === activeSessionId"
                  aria-hidden="true"
                  class="absolute inset-y-1.5 left-0 w-0.5 rounded-r-full bg-foreground"
                />
                <span class="flex h-4 w-4 shrink-0 items-center justify-center">
                  <span :class="cn('block h-1.5 w-1.5 rounded-full', s.id === activeSessionId ? 'animate-pulse bg-emerald-500' : 'bg-muted-foreground/50')" />
                </span>
                <span :class="cn('flex-1 truncate text-sm', s.id === activeSessionId && 'font-medium')">{{ s.title || s.id.slice(0, 14) }}</span>
                <div class="relative ml-auto flex h-4 min-w-7 shrink-0 items-center justify-end">
                  <span
                    :class="cn(
                      'text-xs tabular-nums text-muted-foreground/60 transition-opacity duration-150',
                      (hoveredId === s.id || menuId === s.id) && 'opacity-0',
                    )"
                  >
                    {{ shortRelative(s.time?.updated ?? s.time?.created, now) }}
                  </span>
                  <DropdownMenu @update:open="(open: boolean) => (menuId = open ? s.id : null)">
                    <DropdownMenuTrigger as-child>
                      <button
                        type="button"
                        aria-label="Session actions"
                        :class="cn(
                          'absolute right-0 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-opacity duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                          hoveredId === s.id || menuId === s.id ? 'opacity-100' : 'pointer-events-none opacity-0',
                        )"
                        @click.stop.prevent
                      >
                        <MoreHorizontal class="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-40 p-1">
                      <DropdownMenuItem class="cursor-pointer" @select="emit('delete', s.id)">
                        <Trash2 class="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customize — pinned just above the footer -->
        <button
          type="button"
          class="mt-auto flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-lg p-2 text-left text-sm font-normal text-sidebar-foreground outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
          @click="showCustomize()"
        >
          <SlidersHorizontal />
          <span>Customize</span>
        </button>
      </div>
    </div>

    <!-- Footer — the "you" menu -->
    <div :class="cn('px-2 pb-2 pt-1', collapsed && 'px-0')">
      <SidebarUserMenu v-if="user" :user="user" :collapsed="collapsed" />
    </div>
  </div>
</template>
