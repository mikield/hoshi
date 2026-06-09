<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Button,
  Input,
  EntityAvatar,
  EmptyState,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@kortix/nuxt-ui'
import { Search, Plus, MoreHorizontal, Trash2, FolderPlus } from 'lucide-vue-next'

definePageMeta({ middleware: 'auth' })

const user = useAuthUser()

interface Project {
  id: string
  name: string
  updatedAt: number
}

// Stable reference time shared from server to client (avoids hydration mismatch).
const now = useState('projects:now', () => Date.now())

const projects = ref<Project[]>([
  { id: 'p1', name: 'Retry logic refactor', updatedAt: now.value - 1000 * 60 * 12 },
  { id: 'p2', name: 'Marketing site redesign', updatedAt: now.value - 1000 * 60 * 60 * 4 },
  { id: 'p3', name: 'Onboarding flow audit', updatedAt: now.value - 1000 * 60 * 60 * 24 * 2 },
  { id: 'p4', name: 'Q3 release notes', updatedAt: now.value - 1000 * 60 * 60 * 24 * 9 },
])
const query = ref('')
const createOpen = ref(false)

function relativeTime(ts: number) {
  const minutes = Math.floor((now.value - ts) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

const filtered = computed(() =>
  projects.value.filter((p) => p.name.toLowerCase().includes(query.value.trim().toLowerCase())),
)

const noMatchTitle = computed(() => `No matches for "${query.value}"`)

function openProject(id: string) {
  navigateTo(`/projects/${id}`)
}

function createProject(name: string) {
  const project: Project = { id: `p${Date.now()}`, name, updatedAt: Date.now() }
  projects.value = [project, ...projects.value]
  navigateTo(`/projects/${project.id}`)
}

function archiveProject(id: string) {
  projects.value = projects.value.filter((p) => p.id !== id)
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <AppHeader v-if="user" :user="user" breadcrumb="Projects" />
    <main class="flex-1 px-4 py-10 sm:py-12">
      <div class="mx-auto w-full max-w-6xl space-y-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div class="flex flex-col gap-1">
            <h1 class="text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
            <p class="text-sm text-muted-foreground">Pick up where you left off, or start something new.</p>
          </div>
          <div class="flex w-full items-center gap-2 sm:w-auto">
            <div class="relative flex-1 sm:w-72">
              <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input v-model="query" placeholder="Search projects" class="h-9 pl-9 text-sm" />
            </div>
            <Button class="gap-1.5" @click="createOpen = true">
              <Plus class="size-4" />
              New project
            </Button>
          </div>
        </div>

        <EmptyState
          v-if="projects.length === 0"
          :icon="FolderPlus"
          title="No projects yet"
        >
          <template #description>Create your first project to start chatting with your local OpenCode server.</template>
          <template #action><Button @click="createOpen = true">New project</Button></template>
        </EmptyState>

        <EmptyState
          v-else-if="filtered.length === 0"
          :icon="Search"
          :title="noMatchTitle"
        >
          <template #description>Try a different search term.</template>
        </EmptyState>

        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="project in filtered"
            :key="project.id"
            class="group relative flex flex-col rounded-lg border border-border/60 bg-card transition-all duration-150 hover:border-foreground/30 hover:bg-muted/30 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.18)]"
          >
            <button
              type="button"
              class="flex flex-1 cursor-pointer flex-col items-start gap-4 rounded-lg p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              @click="openProject(project.id)"
            >
              <div class="flex w-full items-center gap-3">
                <EntityAvatar :label="project.name" size="lg" />
                <div class="min-w-0 flex-1">
                  <h3 class="truncate text-sm font-semibold leading-tight text-foreground">{{ project.name }}</h3>
                  <p class="mt-1 truncate text-xs text-muted-foreground">Updated {{ relativeTime(project.updatedAt) }}</p>
                </div>
              </div>
            </button>
            <div class="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 bg-background/80 text-muted-foreground backdrop-blur hover:bg-background hover:text-foreground"
                    aria-label="Project actions"
                    @click.stop
                  >
                    <MoreHorizontal class="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-44">
                  <DropdownMenuItem @select="openProject(project.id)">Open project</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="gap-2 text-muted-foreground focus:text-foreground" @select="archiveProject(project.id)">
                    <Trash2 class="h-3.5 w-3.5" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </main>
    <ProjectCreateModal v-model:open="createOpen" @create="createProject" />
  </div>
</template>
