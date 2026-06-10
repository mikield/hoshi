<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Read-only list of the shortcuts the app actually binds today.
const modSymbol = ref('⌘')
onMounted(() => {
  if (!/Mac|iPod|iPhone|iPad/.test(navigator.platform)) modSymbol.value = 'Ctrl'
})

const SHORTCUTS = [
  { label: 'New session', keys: ['J'] },
  { label: 'Toggle side panel', keys: ['I'] },
  { label: 'Send message', keys: ['Enter'], noMod: true },
  { label: 'New line in message', keys: ['Shift', 'Enter'], noMod: true },
]
</script>

<template>
  <div class="min-w-0 max-w-full space-y-5 overflow-x-hidden p-4 pb-12 sm:space-y-6 sm:p-6 sm:pb-6">
    <div>
      <h3 class="mb-1 text-lg font-semibold">Shortcuts</h3>
      <p class="text-sm text-muted-foreground">Keyboard shortcuts available across the app.</p>
    </div>

    <div class="divide-y rounded-2xl border">
      <div v-for="shortcut in SHORTCUTS" :key="shortcut.label" class="flex items-center justify-between px-3 py-2.5">
        <span class="text-sm text-foreground">{{ shortcut.label }}</span>
        <span class="flex items-center gap-1">
          <kbd v-if="!shortcut.noMod" class="inline-flex h-6 items-center whitespace-nowrap rounded border bg-muted px-2 font-mono text-xs text-muted-foreground">{{ modSymbol }}</kbd>
          <kbd
            v-for="key in shortcut.keys"
            :key="key"
            class="inline-flex h-6 items-center whitespace-nowrap rounded border bg-muted px-2 font-mono text-xs text-muted-foreground"
          >{{ key }}</kbd>
        </span>
      </div>
    </div>
  </div>
</template>
