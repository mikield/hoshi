<script setup lang="ts">
import { computed } from 'vue'
import {
  EntityAvatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Skeleton,
  cn,
} from '@hoshi/ui'
import { ArrowUpRight, Check, ChevronsUpDown, Plus } from 'lucide-vue-next'
import { shortRelative, sqliteTimestamp } from '~/composables/useProjects'

const props = defineProps<{
  projectId: string
  collapsed?: boolean
}>()

const projectsStore = useProjectsStore()
const { projects, now, loading } = storeToRefs(projectsStore)

onMounted(() => projectsStore.load())

const activeProject = computed(() => projects.value.find((p) => p.id === props.projectId))
const label = computed(() => activeProject.value?.name ?? 'Projects')
/** True until the active project's name is actually known. */
const resolving = computed(() => loading.value && !activeProject.value)

function switchProject(id: string) {
  if (id === props.projectId) return
  navigateTo(`/projects/${id}`)
}
</script>

<template>
  <div v-if="resolving" :class="cn('flex w-full items-center gap-2 px-1.5 py-1', collapsed && 'justify-center gap-0 px-0')">
    <Skeleton class="size-6 rounded-md" />
    <Skeleton v-if="!collapsed" class="h-4 flex-1 rounded-md" />
  </div>
  <DropdownMenu v-else>
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        :class="cn(
          'flex w-full cursor-pointer items-center gap-2 rounded-2xl border border-transparent bg-transparent px-1.5 py-1 text-left transition-colors',
          'hover:bg-sidebar-accent/60 data-[state=open]:bg-sidebar-accent',
          collapsed && 'justify-center gap-0 px-0',
        )"
      >
        <EntityAvatar :label="label" size="sm" />
        <template v-if="!collapsed">
          <span class="min-w-0 flex-1 truncate text-left text-sm font-semibold tracking-tight text-foreground">{{ label }}</span>
          <ChevronsUpDown class="ml-auto size-3 shrink-0 text-muted-foreground/40" />
        </template>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" side="bottom" :side-offset="6" class="w-64 overflow-hidden rounded-2xl border-border/60 p-0 shadow-none">
      <div class="py-1.5">
        <div class="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground/50">
          Projects
        </div>
        <div class="max-h-70 overflow-y-auto px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          <DropdownMenuItem
            v-for="project in projects"
            :key="project.id"
            :class="cn(
              'flex h-9 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-0',
              project.id === projectId && 'bg-muted/60',
            )"
            @select="switchProject(project.id)"
          >
            <EntityAvatar :label="project.name" size="xs" />
            <div class="grid min-w-0 flex-1 leading-tight">
              <span class="truncate text-sm font-medium">{{ project.name }}</span>
              <span class="truncate text-xs text-muted-foreground/60">{{ shortRelative(sqliteTimestamp(project.updated_at), now) }} ago</span>
            </div>
            <Check v-if="project.id === projectId" class="size-3.5 shrink-0 text-foreground/70" />
          </DropdownMenuItem>
        </div>
      </div>
      <div class="h-px bg-border/40" />
      <div class="px-1 py-1">
        <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-0 [&_svg]:text-muted-foreground/70!" @select="navigateTo('/projects')">
          <ArrowUpRight class="size-3.5" />
          <span class="flex-1 truncate text-sm font-medium text-foreground/80">All projects</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-0 [&_svg]:text-muted-foreground/70!" @select="navigateTo('/projects?new=1')">
          <Plus class="size-3.5" />
          <span class="flex-1 truncate text-sm font-medium text-foreground/80">New project</span>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
