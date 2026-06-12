<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'

// Persistent project chrome: the sidebar + shell stay mounted while the
// project home and session pages swap inside — navigation between them
// transitions the content pane instead of reflashing the whole shell.
const route = useRoute()
const projectId = computed(() => route.params.id as string)
const activeSessionId = computed(() => (route.params.sessionId as string | undefined) ?? null)

const store = useSessionsStore()
const { sessions, loading, creating } = storeToRefs(store)

// The sidebar owns the list, so the layout keeps it live — titles, deletions,
// and sessions spawned externally (webhooks, schedules, other devices).
let unsubscribe: (() => void) | null = null

onMounted(() => {
  if (projectId.value) void store.load(projectId.value)
  unsubscribe = useEventsStore().subscribe(store.applyEvent)
})

onBeforeUnmount(() => {
  unsubscribe?.()
})

watch(projectId, (id, prev) => {
  if (id && id !== prev) void store.load(id, true)
})

function select(id: string) {
  navigateTo(`/projects/${projectId.value}/sessions/${id}`)
}
</script>

<template>
  <ProjectShell
    :project-id="projectId"
    :sessions="sessions"
    :active-session-id="activeSessionId"
    :loading="loading"
    :creating="creating"
    @select="select"
    @create="store.createBlank(projectId)"
    @delete="store.remove(projectId, $event)"
  >
    <slot />
  </ProjectShell>
</template>
