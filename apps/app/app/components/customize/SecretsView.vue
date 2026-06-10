<script setup lang="ts">
import { Button, EmptyState } from '@hoshi/ui'
import { KeyRound, Plus } from 'lucide-vue-next'

// Mock surface — secret storage has no backend yet. The chrome matches the
// real section so functionality can drop in without a redesign.
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="KeyRound" title="Secrets">
      <template #actions>
        <Button size="sm" variant="outline" class="gap-1.5" disabled>
          <Plus class="size-3.5" />
          Add secret
        </Button>
      </template>
    </CustomizeSectionHeader>
    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div class="mx-auto w-full max-w-3xl space-y-5 px-4 py-8">
        <EmptyState :icon="KeyRound" title="No secrets yet">
          <template #description>
            API keys and tokens your sessions need will live here, shared across the project or scoped to you.
          </template>
        </EmptyState>
      </div>
    </div>
  </div>
</template>
