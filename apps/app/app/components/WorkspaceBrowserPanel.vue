<script setup lang="ts">
import { ref } from 'vue'
import { EmptyState } from '@hoshi/ui'
import { Globe, RefreshCw, ExternalLink } from 'lucide-vue-next'

const input = ref('http://localhost:3000')
const src = ref<string | null>(null)
/** Bumped to force the iframe to re-mount on reload. */
const frameKey = ref(0)

function normalize(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return /^https?:\/\//.test(trimmed) ? trimmed : `http://${trimmed}`
}

function go() {
  const url = normalize(input.value)
  if (!url) return
  input.value = url
  src.value = url
  frameKey.value++
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex h-9 shrink-0 items-center gap-1.5 border-b border-border/50 px-2.5">
      <form class="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1" @submit.prevent="go">
        <Globe class="size-3 shrink-0 text-muted-foreground" />
        <input
          v-model="input"
          type="text"
          placeholder="http://localhost:3000"
          spellcheck="false"
          class="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </form>
      <button
        type="button"
        class="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
        title="Reload"
        @click="go"
      >
        <RefreshCw class="size-3.5" />
      </button>
      <a
        v-if="src"
        :href="src"
        target="_blank"
        rel="noopener"
        class="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
        title="Open in new tab"
      >
        <ExternalLink class="size-3.5" />
      </a>
    </div>
    <iframe
      v-if="src"
      :key="frameKey"
      :src="src"
      class="min-h-0 w-full flex-1 border-0 bg-white"
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
    <EmptyState v-else :icon="Globe" title="Preview a URL" size="sm" class="flex-1">
      <template #description>Point this at your dev server to watch the app while the agent works on it.</template>
    </EmptyState>
  </div>
</template>
