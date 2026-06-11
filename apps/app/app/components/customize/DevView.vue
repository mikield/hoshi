<script setup lang="ts">
import { Terminal } from 'lucide-vue-next'
import { opencodeUrl } from '~/composables/useOpencode'

// Local-development guide for connecting an OpenCode server to the app.
const STEPS = [
  {
    title: 'Install OpenCode',
    hint: 'The agent runtime this app drives.',
    command: 'npm install -g opencode-ai',
  },
  {
    title: 'Start the server',
    hint: `The app reaches it through the Hoshi API proxy at ${opencodeUrl()}.`,
    command: 'opencode serve',
  },
  {
    title: 'Open a session',
    hint: 'Create a session from the sidebar — it runs against your local server.',
    command: null,
  },
]
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="Terminal" title="Dev" />
    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div class="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
        <div v-for="(step, i) in STEPS" :key="step.title" class="flex gap-3.5">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-xs font-semibold tabular-nums text-muted-foreground">{{ i + 1 }}</span>
          <div class="min-w-0 flex-1 leading-tight">
            <div class="text-sm font-medium text-foreground">{{ step.title }}</div>
            <p class="mt-0.5 text-xs text-muted-foreground">{{ step.hint }}</p>
            <pre v-if="step.command" class="mt-2 overflow-x-auto rounded-xl border border-border/60 bg-card/50 px-3.5 py-2.5 font-mono text-xs text-foreground">{{ step.command }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
