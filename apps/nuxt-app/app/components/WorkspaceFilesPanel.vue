<script setup lang="ts">
import { ref } from 'vue'
import type { TreeNode } from './WorkspaceFileTreeRow.vue'

const FILE_TREE: TreeNode[] = [
  {
    name: 'src',
    children: [
      {
        name: 'lib',
        children: [
          { name: 'retry.ts', path: 'src/lib/retry.ts' },
          { name: 'utils.ts', path: 'src/lib/utils.ts' },
        ],
      },
      { name: 'index.ts', path: 'src/index.ts' },
    ],
  },
  { name: 'package.json', path: 'package.json' },
]

const expanded = ref<Set<string>>(new Set(['src', 'src/lib']))
const selected = ref('src/lib/retry.ts')

function toggle(path: string) {
  const next = new Set(expanded.value)
  if (next.has(path)) next.delete(path)
  else next.add(path)
  expanded.value = next
}
</script>

<template>
  <div class="grid h-full grid-cols-[180px_minmax(0,1fr)]">
    <div class="overflow-y-auto border-r border-border/60 bg-muted/[0.18] p-2">
      <WorkspaceFileTreeRow
        v-for="n in FILE_TREE"
        :key="n.name"
        :node="n"
        :depth="0"
        :expanded="expanded"
        :selected="selected"
        @toggle="toggle"
        @select="selected = $event"
      />
    </div>
    <div class="overflow-auto p-4 font-mono text-xs leading-[1.7] text-foreground/75">
      <div class="mb-2 text-muted-foreground/60">{{ selected }}</div>
      <div>export function retry(fn, attempts = 3) {</div>
      <div class="pl-4">for (let i = 0; i &lt; attempts; i++) {</div>
      <div class="pl-8">try { return fn(); }</div>
      <div class="pl-8">catch (e) { if (i === attempts - 1) throw e; }</div>
      <div class="pl-4">}</div>
      <div>}</div>
    </div>
  </div>
</template>
