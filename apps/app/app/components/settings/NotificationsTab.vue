<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@hoshi/ui'
import { Bell, CircleAlert, MessageSquare, Sparkles } from 'lucide-vue-next'
import type { Component } from 'vue'

// Mock surface — desktop notifications have no implementation yet.
const enabled = ref(false)

const TYPES: { icon: Component; label: string; description: string }[] = [
  { icon: Sparkles, label: 'Session finished', description: 'The agent completed a turn while you were away.' },
  { icon: MessageSquare, label: 'Needs your input', description: 'The agent asked a question or needs a permission.' },
  { icon: CircleAlert, label: 'Errors', description: 'A session failed or lost its connection.' },
]
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h3 class="mb-1 text-lg font-semibold">Notifications</h3>
      <p class="text-sm text-muted-foreground">Desktop alerts for session activity.</p>
    </div>

    <!-- Master toggle -->
    <div class="rounded-2xl border p-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-1 items-start gap-3">
          <Bell class="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div class="flex-1 space-y-0.5">
            <div class="cursor-pointer text-sm font-medium">Enable notifications</div>
            <p class="text-xs text-muted-foreground">Allow the app to send desktop notifications.</p>
          </div>
        </div>
        <Switch v-model="enabled" disabled />
      </div>
    </div>

    <!-- Per-type toggles -->
    <div class="divide-y rounded-2xl border">
      <div v-for="type in TYPES" :key="type.label" class="flex items-start justify-between gap-4 px-4 py-3">
        <div class="flex flex-1 items-start gap-3">
          <component :is="type.icon" class="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div class="flex-1 space-y-0.5">
            <div class="text-sm font-medium">{{ type.label }}</div>
            <p class="text-xs text-muted-foreground">{{ type.description }}</p>
          </div>
        </div>
        <Switch :model-value="false" disabled />
      </div>
    </div>
  </div>
</template>
