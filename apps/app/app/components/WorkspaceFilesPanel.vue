<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { cn, DiffStat, EmptyState, HoshiLoader } from '@hoshi/ui'
import { FolderOpen, FileX2, RefreshCw } from 'lucide-vue-next'
import {
  createOpencodeClient,
  fetchFileTree,
  readFile,
  fetchFileStatus,
  OPENCODE_CONNECT_ERROR,
  type OpencodeClient,
  type FileNode,
  type FileContent,
  type FileStatusEntry,
} from '~/composables/useOpencode'

let client: OpencodeClient | null = null

const childrenByDir = ref(new Map<string, FileNode[]>())
const expanded = ref(new Set<string>())
const statusByPath = ref(new Map<string, FileStatusEntry>())
const selected = ref<FileNode | null>(null)
const content = ref<FileContent | null>(null)
const loadingTree = ref(true)
const loadingFile = ref(false)
const error = ref<string | null>(null)

const ROOT = '.'

/** Tree flattened to visible rows: expanded directories contribute children. */
const rows = computed<{ node: FileNode; depth: number }[]>(() => {
  const out: { node: FileNode; depth: number }[] = []
  const walk = (dir: string, depth: number) => {
    for (const node of childrenByDir.value.get(dir) ?? []) {
      out.push({ node, depth })
      if (node.type === 'directory' && expanded.value.has(node.path)) walk(node.path, depth + 1)
    }
  }
  walk(ROOT, 0)
  return out
})

const contentLines = computed(() =>
  content.value?.type === 'text' ? content.value.content.split('\n') : [],
)

const imageSrc = computed(() => {
  const file = content.value
  if (file?.type !== 'binary' || !file.mimeType?.startsWith('image/')) return null
  return `data:${file.mimeType};base64,${file.content}`
})

function sortNodes(nodes: FileNode[]): FileNode[] {
  return [...nodes].sort((a, b) =>
    a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'directory' ? -1 : 1,
  )
}

async function loadDir(path: string) {
  childrenByDir.value.set(path, sortNodes(await fetchFileTree(client!, path)))
  childrenByDir.value = new Map(childrenByDir.value)
}

async function refresh() {
  loadingTree.value = true
  error.value = null
  try {
    const [, statuses] = await Promise.all([
      loadDir(ROOT),
      fetchFileStatus(client!).catch(() => [] as FileStatusEntry[]),
    ])
    statusByPath.value = new Map(statuses.map((s) => [s.path, s]))
    // Re-fetch directories that are still expanded so the tree stays coherent.
    await Promise.all([...expanded.value].map((dir) => loadDir(dir).catch(() => {})))
  } catch {
    error.value = OPENCODE_CONNECT_ERROR
  } finally {
    loadingTree.value = false
  }
}

async function activate(node: FileNode) {
  if (node.type === 'directory') {
    const next = new Set(expanded.value)
    if (next.has(node.path)) {
      next.delete(node.path)
    } else {
      next.add(node.path)
      if (!childrenByDir.value.has(node.path)) await loadDir(node.path).catch(() => {})
    }
    expanded.value = next
    return
  }
  selected.value = node
  loadingFile.value = true
  content.value = null
  try {
    content.value = await readFile(client!, node.path)
  } catch {
    content.value = null
  } finally {
    loadingFile.value = false
  }
}

/** Status of the selected file, for the viewer header diff badge. */
const selectedStatus = computed(() =>
  selected.value ? statusByPath.value.get(selected.value.path) : undefined,
)

onMounted(async () => {
  client = await createOpencodeClient()
  await refresh()
})
</script>

<template>
  <div class="grid h-full grid-cols-[200px_minmax(0,1fr)]">
    <!-- Tree -->
    <div class="flex min-h-0 flex-col border-r border-border/60 bg-muted/[0.18]">
      <div class="flex h-8 shrink-0 items-center justify-between pl-3 pr-1.5">
        <span class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">Workspace</span>
        <button
          type="button"
          class="inline-flex size-6 cursor-pointer items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
          title="Refresh tree"
          @click="refresh"
        >
          <RefreshCw :class="cn('size-3', loadingTree && 'animate-spin')" />
        </button>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto p-2 pt-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <template v-if="rows.length > 0">
          <WorkspaceFileTreeRow
            v-for="row in rows"
            :key="row.node.path"
            :node="row.node"
            :depth="row.depth"
            :expanded="expanded.has(row.node.path)"
            :active="selected?.path === row.node.path"
            :status="statusByPath.get(row.node.path)?.status"
            @activate="activate"
          />
        </template>
        <div v-else-if="loadingTree" class="flex justify-center py-8"><HoshiLoader class="size-4" /></div>
        <p v-else class="px-2 py-6 text-center text-xs text-muted-foreground/70">{{ error ?? 'Empty workspace.' }}</p>
      </div>
    </div>

    <!-- Viewer -->
    <div class="flex min-h-0 flex-col">
      <template v-if="selected">
        <div class="flex h-8 shrink-0 items-center justify-between gap-3 border-b border-border/50 px-3.5">
          <span class="truncate font-mono text-xs text-muted-foreground">{{ selected.path }}</span>
          <DiffStat
            v-if="selectedStatus"
            :additions="selectedStatus.added"
            :deletions="selectedStatus.removed"
            class="shrink-0 text-[11px]"
          />
        </div>
        <div class="min-h-0 flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          <div v-if="loadingFile" class="flex justify-center py-10"><HoshiLoader class="size-4" /></div>
          <img v-else-if="imageSrc" :src="imageSrc" :alt="selected.name" class="max-w-full p-4" />
          <div v-else-if="content?.type === 'text'" class="p-3.5 font-mono text-xs leading-[1.7]">
            <div v-for="(line, i) in contentLines" :key="i" class="flex">
              <span class="w-9 shrink-0 select-none pr-3 text-right tabular-nums text-muted-foreground/40">{{ i + 1 }}</span>
              <span class="whitespace-pre text-foreground/80">{{ line }}</span>
            </div>
          </div>
          <EmptyState v-else :icon="FileX2" title="Can't preview this file" size="sm" class="h-full">
            <template #description>Binary file without an image preview.</template>
          </EmptyState>
        </div>
      </template>
      <EmptyState v-else :icon="FolderOpen" title="Select a file" size="sm" class="h-full">
        <template #description>Browse the agent's workspace — changed files are marked with a dot.</template>
      </EmptyState>
    </div>
  </div>
</template>
