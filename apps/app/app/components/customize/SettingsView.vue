<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button, Input, Label, ConfirmDialog } from '@hoshi/ui'
import { Loader2, Settings } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps<{ projectId: string }>()

const projectsStore = useProjectsStore()
const { projects } = storeToRefs(projectsStore)
const { rename, remove } = projectsStore
const project = computed(() => projects.value.find((p) => p.id === props.projectId) ?? null)

const name = ref('')
const saving = ref(false)
const deleteOpen = ref(false)

watch(project, (p) => (name.value = p?.name ?? ''), { immediate: true })

const dirty = computed(() => !!project.value && name.value.trim() !== project.value.name && !!name.value.trim())

async function save() {
  if (!dirty.value || saving.value || !project.value) return
  saving.value = true
  try {
    await rename(project.value.id, name.value.trim())
    toast.success('Project updated')
  } catch {
    toast.error('Failed to update project')
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  deleteOpen.value = false
  if (!project.value) return
  try {
    await remove(project.value.id)
    toast.success('Project deleted')
    await navigateTo('/projects')
  } catch {
    toast.error('Failed to delete project')
  }
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="Settings" title="Settings" />
    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div class="mx-auto w-full max-w-3xl space-y-5 px-4 py-8">
        <!-- General -->
        <div class="rounded-2xl border border-border/60 bg-card">
          <div class="border-b border-border/60 px-6 py-4">
            <h2 class="text-base font-semibold text-foreground">General</h2>
            <p class="mt-0.5 text-xs text-muted-foreground">Basic information about this project.</p>
          </div>
          <form class="space-y-4 px-6 py-5" @submit.prevent="save">
            <div class="space-y-1.5">
              <Label for="customize-project-name">Project name</Label>
              <Input id="customize-project-name" v-model="name" maxlength="120" class="max-w-md" />
            </div>
            <div class="flex items-center justify-between border-t border-border/60 pt-4">
              <span class="text-xs text-muted-foreground">Renames apply everywhere immediately.</span>
              <Button type="submit" size="sm" class="gap-1.5" :disabled="!dirty || saving">
                <Loader2 v-if="saving" class="size-3.5 animate-spin" />
                Save changes
              </Button>
            </div>
          </form>
        </div>

        <!-- Danger zone -->
        <div class="rounded-2xl border border-destructive/30 bg-card">
          <div class="border-b border-destructive/20 px-6 py-4">
            <h2 class="text-base font-semibold text-destructive">Danger zone</h2>
            <p class="mt-0.5 text-xs text-muted-foreground">Irreversible actions for this project.</p>
          </div>
          <div class="flex items-center justify-between gap-4 px-6 py-5">
            <div class="leading-tight">
              <div class="text-sm font-medium text-foreground">Delete project</div>
              <p class="mt-0.5 text-xs text-muted-foreground">Removes the project and its session links. OpenCode sessions are kept.</p>
            </div>
            <Button variant="destructive" size="sm" class="shrink-0" @click="deleteOpen = true">Delete</Button>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :open="deleteOpen"
      title="Delete project?"
      confirm-label="Delete"
      confirm-variant="destructive"
      @confirm="confirmDelete"
      @update:open="(open: boolean) => (deleteOpen = open)"
    >
      <template #description>
        This removes "{{ project?.name }}" and its session links. This action cannot be undone.
      </template>
    </ConfirmDialog>
  </div>
</template>
