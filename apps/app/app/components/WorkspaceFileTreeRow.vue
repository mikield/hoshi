<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@hoshi/ui'
import { ChevronRight, Folder, FolderOpen, FileCode, FileJson, FileText, Image } from 'lucide-vue-next'
import type { FileNode, FileStatusEntry } from '~/composables/useOpencode'

const props = defineProps<{
  node: FileNode
  depth: number
  expanded: boolean
  active: boolean
  status?: FileStatusEntry['status']
}>()

const emit = defineEmits<{ activate: [node: FileNode] }>()

const isDir = computed(() => props.node.type === 'directory')

const icon = computed(() => {
  if (isDir.value) return props.expanded ? FolderOpen : Folder
  const name = props.node.name.toLowerCase()
  if (/\.(json|jsonc|lock)$/.test(name)) return FileJson
  if (/\.(png|jpe?g|gif|webp|svg|ico)$/.test(name)) return Image
  if (/\.(md|mdx|txt|log)$/.test(name)) return FileText
  return FileCode
})

const STATUS_DOT: Record<FileStatusEntry['status'], string> = {
  added: 'bg-emerald-500',
  modified: 'bg-amber-500',
  deleted: 'bg-destructive',
}
</script>

<template>
  <button
    type="button"
    :class="cn(
      'flex w-full cursor-pointer items-center gap-1.5 rounded-lg py-1 pr-2 text-left text-sm transition-colors',
      active ? 'bg-primary/[0.07] text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
      node.ignored && 'opacity-50',
    )"
    :style="{ paddingLeft: `${depth * 14 + 8}px` }"
    @click="emit('activate', node)"
  >
    <ChevronRight
      v-if="isDir"
      :class="cn('size-3.5 shrink-0 text-muted-foreground/60 transition-transform', expanded && 'rotate-90')"
    />
    <span v-else class="w-3.5 shrink-0" />
    <component :is="icon" class="size-4 shrink-0" />
    <span class="min-w-0 flex-1 truncate">{{ node.name }}</span>
    <span v-if="status" :class="cn('size-1.5 shrink-0 rounded-full', STATUS_DOT[status])" :title="status" />
  </button>
</template>
