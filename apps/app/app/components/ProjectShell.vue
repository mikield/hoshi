<script setup lang="ts">
import type { SessionInfo } from '~/composables/useOpencode'

defineProps<{
  projectId: string
  sessions: SessionInfo[]
  activeSessionId: string | null
  loading: boolean
  creating?: boolean
}>()

const emit = defineEmits<{ select: [id: string]; create: []; delete: [id: string] }>()
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-sidebar">
    <ProjectSidebar
      :project-id="projectId"
      :sessions="sessions"
      :active-session-id="activeSessionId"
      :loading="loading"
      :creating="creating"
      @select="emit('select', $event)"
      @create="emit('create')"
      @delete="emit('delete', $event)"
    />
    <div class="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <!-- Thin floating strip so the rounded panel doesn't bleed to the top edge -->
      <div class="hidden h-3 shrink-0 bg-sidebar md:block" />
      <div class="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background md:mr-3 md:rounded-t-xl md:border md:border-b-0 md:border-border/50">
        <slot />
      </div>
    </div>
  </div>
</template>
