<script setup lang="ts">
import { Badge, Button, Progress } from '@hoshi/ui'
import { Cpu, MessageSquare, Wallet } from 'lucide-vue-next'

// Mock surface — billing has no backend yet. The overview/spend/limits cards
// mirror the live layout so real numbers can drop in unchanged.
const LIMITS = [
  { icon: MessageSquare, label: 'Concurrent sessions', used: 1, cap: 5 },
  { icon: Cpu, label: 'Compute hours this period', used: 12, cap: 100 },
]
</script>

<template>
  <div class="space-y-4">
    <!-- Plan + wallet + status -->
    <div class="rounded-2xl border border-border/60 bg-card p-5">
      <div class="grid gap-3 sm:grid-cols-3">
        <div>
          <div class="text-xs text-muted-foreground">Plan</div>
          <div class="mt-1 flex items-center gap-2">
            <Badge variant="secondary">Free · 1 seat</Badge>
          </div>
        </div>
        <div>
          <div class="text-xs text-muted-foreground">Wallet</div>
          <div class="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Wallet class="size-3.5 text-muted-foreground" />
            $0.00
          </div>
        </div>
        <div>
          <div class="text-xs text-muted-foreground">Status</div>
          <div class="mt-1"><Badge variant="outline">Active</Badge></div>
        </div>
      </div>
    </div>

    <!-- Spend this period -->
    <div class="rounded-2xl border border-border/60 bg-card p-5">
      <div class="mb-4 flex items-baseline justify-between">
        <h3 class="text-sm font-semibold text-foreground">Spend this period</h3>
        <span class="text-xs tabular-nums text-muted-foreground">$0.00 total</span>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-2xl border border-border/60 bg-background p-3">
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <Cpu class="size-3.5" />
            Compute
          </div>
          <div class="mt-1 text-xl font-semibold tabular-nums text-foreground">$0.00</div>
          <div class="mt-0.5 text-xs text-muted-foreground">Sandbox runtime</div>
        </div>
        <div class="rounded-2xl border border-border/60 bg-background p-3">
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquare class="size-3.5" />
            LLM
          </div>
          <div class="mt-1 text-xl font-semibold tabular-nums text-foreground">$0.00</div>
          <div class="mt-0.5 text-xs text-muted-foreground">Model tokens</div>
        </div>
      </div>
    </div>

    <!-- Limits -->
    <div class="rounded-2xl border border-border/60 bg-card p-5">
      <h3 class="mb-4 text-sm font-semibold text-foreground">Limits</h3>
      <div class="space-y-4">
        <div v-for="limit in LIMITS" :key="limit.label" class="space-y-1.5">
          <div class="flex items-center justify-between text-sm">
            <span class="flex items-center gap-1.5 text-muted-foreground">
              <component :is="limit.icon" class="size-3.5" />
              {{ limit.label }}
            </span>
            <span class="font-medium tabular-nums text-foreground">{{ limit.used }} / {{ limit.cap }}</span>
          </div>
          <Progress :model-value="(limit.used / limit.cap) * 100" class="h-1.5" />
        </div>
      </div>
    </div>

    <!-- Manage -->
    <div class="border-t border-border pt-4">
      <Button size="sm" variant="outline" class="h-8 text-xs" disabled>Manage billing</Button>
    </div>
  </div>
</template>
