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
  ConfirmDialog,
} from '@hoshi/ui'
import { Search, Plus, MoreHorizontal, Pencil, Trash2, FolderPlus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useProjects, shortRelative, sqliteTimestamp, type Project } from '~/composables/useProjects'

definePageMeta({ middleware: 'auth' })

const user = useAuthUser()
const { projects, loading, loadError, now, load, create, rename, remove } = useProjects()

const query = ref('')
const createOpen = ref(false)
const projectToRename = ref<Project | null>(null)
const renameInput = ref('')
const projectToDelete = ref<Project | null>(null)

onMounted(() => load())

const filtered = computed(() =>
  projects.value.filter((p) => p.name.toLowerCase().includes(query.value.trim().toLowerCase())),
)

const noMatchTitle = computed(() => `No matches for "${query.value}"`)

function updatedLabel(project: Project): string {
  const relative = shortRelative(sqliteTimestamp(project.updated_at), now.value)
  return relative ? `Updated ${relative} ago` : 'Just created'
}

function openProject(id: string) {
  navigateTo(`/projects/${id}`)
}

async function createProject(name: string) {
  try {
    const project = await create(name)
    await navigateTo(`/projects/${project.id}`)
  } catch {
    // Close the modal so its pending state doesn't stick after a failure.
    createOpen.value = false
    toast.error('Failed to create project')
  }
}

function startRename(project: Project) {
  projectToRename.value = project
  renameInput.value = project.name
}

async function confirmRename() {
  const project = projectToRename.value
  const name = renameInput.value.trim()
  projectToRename.value = null
  if (!project || !name || name === project.name) return
  try {
    await rename(project.id, name)
  } catch {
    toast.error('Failed to rename project')
  }
}

async function confirmDelete() {
  const project = projectToDelete.value
  projectToDelete.value = null
  if (!project) return
  try {
    await remove(project.id)
    toast.success('Project deleted')
  } catch {
    toast.error('Failed to delete project')
  }
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

        <div v-if="loading && projects.length === 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="h-24 animate-pulse rounded-lg border border-border/40 bg-muted/30" />
        </div>

        <EmptyState v-else-if="loadError" :icon="FolderPlus" title="Couldn't load projects">
          <template #description>Something went wrong while fetching your projects.</template>
          <template #action><Button variant="outline" @click="load(true)">Retry</Button></template>
        </EmptyState>

        <EmptyState
          v-else-if="projects.length === 0"
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
                  <p class="mt-1 truncate text-xs text-muted-foreground">{{ updatedLabel(project) }}</p>
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
                  <DropdownMenuItem class="gap-2" @select="startRename(project)">
                    <Pencil class="h-3.5 w-3.5" />
                    Rename…
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="gap-2 text-muted-foreground focus:text-foreground" @select="projectToDelete = project">
                    <Trash2 class="h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </main>

    <ProjectCreateModal v-model:open="createOpen" @create="createProject" />

    <!-- Rename -->
    <ConfirmDialog
      :open="projectToRename !== null"
      title="Rename project"
      confirm-label="Rename"
      @confirm="confirmRename"
      @update:open="(open: boolean) => { if (!open) projectToRename = null }"
    >
      <template #description>
        <Input v-model="renameInput" placeholder="Project name" maxlength="120" autofocus class="mt-2" @keydown.enter.prevent="confirmRename" />
      </template>
    </ConfirmDialog>

    <!-- Delete -->
    <ConfirmDialog
      :open="projectToDelete !== null"
      title="Delete project?"
      confirm-label="Delete"
      confirm-variant="destructive"
      @confirm="confirmDelete"
      @update:open="(open: boolean) => { if (!open) projectToDelete = null }"
    >
      <template #description>
        This removes “{{ projectToDelete?.name }}” and its session links. Sessions on the OpenCode server are kept.
      </template>
    </ConfirmDialog>
  </div>
</template>
