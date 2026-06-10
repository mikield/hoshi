<script setup lang="ts">
import { Button, EmptyState } from '@hoshi/ui'
import { Plus, Webhook } from 'lucide-vue-next'

// Mock surface — inbound webhooks have no backend yet.
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="Webhook" title="Webhooks">
      <template #actions>
        <Button size="sm" variant="outline" class="gap-1.5" disabled>
          <Plus class="size-3.5" />
          New webhook
        </Button>
      </template>
    </CustomizeSectionHeader>
    <div class="flex min-h-0 flex-1 items-center justify-center">
      <EmptyState :icon="Webhook" title="No webhooks yet">
        <template #description>Trigger a session from external events — CI failures, form submissions, alerts.</template>
      </EmptyState>
    </div>
  </div>
</template>
