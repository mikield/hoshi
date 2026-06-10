<script setup lang="ts">
import { Button, EmptyState } from '@hoshi/ui'
import { Plus, Timer } from 'lucide-vue-next'

// Mock surface — scheduled sessions have no backend yet.
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="Timer" title="Schedules">
      <template #actions>
        <Button size="sm" variant="outline" class="gap-1.5" disabled>
          <Plus class="size-3.5" />
          New schedule
        </Button>
      </template>
    </CustomizeSectionHeader>
    <div class="flex min-h-0 flex-1 items-center justify-center">
      <EmptyState :icon="Timer" title="No schedules yet">
        <template #description>Run a prompt on a recurring schedule — daily triage, weekly reports, anything.</template>
      </EmptyState>
    </div>
  </div>
</template>
