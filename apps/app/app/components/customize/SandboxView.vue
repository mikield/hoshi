<script setup lang="ts">
import { Badge, Button } from '@hoshi/ui'
import { Container } from 'lucide-vue-next'

// Mock surface — sandbox management has no backend yet.
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="Container" title="Sandbox" />
    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div class="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
        <div class="rounded-2xl border border-border/60 bg-card">
          <div class="border-b border-border/60 px-6 py-4">
            <h2 class="text-base font-semibold text-foreground">Snapshot</h2>
            <p class="mt-0.5 text-xs text-muted-foreground">The environment image new sessions boot from.</p>
          </div>
          <div class="flex items-center justify-between gap-4 px-6 py-5">
            <div class="flex items-center gap-2">
              <Badge variant="secondary">default</Badge>
              <span class="text-sm text-muted-foreground">Local OpenCode workspace</span>
            </div>
            <Button size="sm" variant="outline" disabled>Rebuild</Button>
          </div>
        </div>

        <div class="rounded-2xl border border-border/60 bg-card">
          <div class="border-b border-border/60 px-6 py-4">
            <h2 class="text-base font-semibold text-foreground">Warm pool</h2>
            <p class="mt-0.5 text-xs text-muted-foreground">Pre-booted sandboxes so sessions start instantly.</p>
          </div>
          <div class="flex items-center justify-between gap-4 px-6 py-5">
            <span class="text-sm text-muted-foreground">Not available for local instances.</span>
            <Badge variant="outline">Disabled</Badge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
