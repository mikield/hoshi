<script setup lang="ts">
import { Button, EmptyState } from '@hoshi/ui'
import { KeyRound, Plus } from 'lucide-vue-next'

// Mock surface — personal access tokens have no backend yet.
</script>

<template>
  <div class="min-w-0 max-w-full space-y-5 overflow-x-hidden p-4 pb-12 sm:space-y-6 sm:p-6 sm:pb-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="mb-1 text-lg font-semibold">CLI tokens</h3>
        <p class="text-sm text-muted-foreground">Personal access tokens for the CLI and API.</p>
      </div>
      <Button size="sm" variant="outline" class="gap-1.5" disabled>
        <Plus class="size-3.5" />
        New token
      </Button>
    </div>

    <EmptyState :icon="KeyRound" title="No tokens yet">
      <template #description>Tokens you create will be listed here. They inherit your permissions.</template>
    </EmptyState>
  </div>
</template>
