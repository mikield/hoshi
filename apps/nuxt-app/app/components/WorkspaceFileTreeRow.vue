<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@kortix/nuxt-ui'
import { ChevronRight, Folder, FolderOpen, FileCode, FileJson } from 'lucide-vue-next'

export interface TreeNode {
  name: string
  path?: string
  children?: TreeNode[]
}

const props = defineProps<{
  node: TreeNode
  depth: number
  dirPath?: string
  expanded: Set<string>
  selected: string
}>()

const emit = defineEmits<{ toggle: [path: string]; select: [path: string] }>()

const isDir = computed(() => !!props.node.children)
const selfPath = computed(() => (props.dirPath ? `${props.dirPath}/${props.node.name}` : props.node.name))
const isOpen = computed(() => isDir.value && props.expanded.has(selfPath.value))
const isActive = computed(() => !isDir.value && props.node.path === props.selected)
const icon = computed(() => {
  if (isDir.value) return isOpen.value ? FolderOpen : Folder
  return props.node.name.endsWith('.json') ? FileJson : FileCode
})

function onClick() {
  if (isDir.value) emit('toggle', selfPath.value)
  else if (props.node.path) emit('select', props.node.path)
}
</script>

<template>
  <button
    type="button"
    :class="cn(
      'flex w-full cursor-pointer items-center gap-1.5 rounded-lg py-1 pr-2 text-left text-sm transition-colors',
      isActive ? 'bg-primary/[0.07] text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
    )"
    :style="{ paddingLeft: `${depth * 14 + 8}px` }"
    @click="onClick"
  >
    <ChevronRight
      v-if="isDir"
      :class="cn('size-3.5 shrink-0 text-muted-foreground/60 transition-transform', isOpen && 'rotate-90')"
    />
    <span v-else class="w-3.5 shrink-0" />
    <component :is="icon" class="size-4 shrink-0" />
    <span class="truncate">{{ node.name }}</span>
  </button>
  <template v-if="isDir && isOpen">
    <WorkspaceFileTreeRow
      v-for="child in node.children"
      :key="child.name"
      :node="child"
      :depth="depth + 1"
      :dir-path="selfPath"
      :expanded="expanded"
      :selected="selected"
      @toggle="emit('toggle', $event)"
      @select="emit('select', $event)"
    />
  </template>
</template>
