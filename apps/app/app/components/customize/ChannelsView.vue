<script setup lang="ts">
import { Button } from '@hoshi/ui'
import { MessageSquare } from 'lucide-vue-next'

// Mock surface — chat-channel integrations have no backend yet.
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="MessageSquare" title="Channels" />
    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div class="mx-auto w-full max-w-3xl space-y-5 px-4 py-8">
        <div class="rounded-2xl border border-border/60 bg-card">
          <div class="border-b border-border/60 px-6 py-4">
            <h2 class="text-base font-semibold text-foreground">Slack</h2>
            <p class="mt-0.5 text-xs text-muted-foreground">Talk to your sessions straight from a Slack channel.</p>
          </div>
          <div class="flex items-center justify-between gap-4 px-6 py-5">
            <p class="text-sm text-muted-foreground">Not connected yet.</p>
            <Button size="sm" disabled>Connect Slack</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
