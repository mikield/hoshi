<script setup lang="ts">
import { ref } from 'vue'
import { EmptyState, cn } from '@hoshi/ui'
import { GitPullRequest } from 'lucide-vue-next'

// Mock surface — change requests / versions have no backend yet.
const tab = ref<'requests' | 'versions'>('requests')
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="GitPullRequest" title="Changes" />
    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div class="mx-auto w-full max-w-3xl px-4 py-6">
        <div class="flex items-center gap-1">
          <button
            v-for="option in (['requests', 'versions'] as const)"
            :key="option"
            type="button"
            :class="cn(
              'h-8 cursor-pointer rounded-lg px-3 text-sm font-medium transition-colors',
              tab === option ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
            )"
            @click="tab = option"
          >
            {{ option === 'requests' ? 'Change requests' : 'Versions' }}
          </button>
        </div>
        <EmptyState
          :icon="GitPullRequest"
          :title="tab === 'requests' ? 'No change requests yet' : 'No versions yet'"
          class="mt-10"
        >
          <template #description>
            {{ tab === 'requests' ? 'Session branches land here for review before merging.' : 'Published versions of this project will be listed here.' }}
          </template>
        </EmptyState>
      </div>
    </div>
  </div>
</template>
