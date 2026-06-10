<script setup lang="ts">
import { ref } from 'vue'
import { Switch, cn } from '@hoshi/ui'
import { Volume2 } from 'lucide-vue-next'

// Mock surface — sound playback has no implementation yet.
const pack = ref('subtle')
const volume = ref(60)

const PACKS = [
  { id: 'subtle', label: 'Subtle', description: 'Quiet ticks and soft chimes.' },
  { id: 'classic', label: 'Classic', description: 'Familiar notification sounds.' },
  { id: 'off', label: 'Off', description: 'No sounds at all.' },
]

const EVENTS = [
  { id: 'done', label: 'Session finished', description: 'When the agent completes a turn.', enabled: true },
  { id: 'question', label: 'Needs your input', description: 'When the agent asks a question.', enabled: true },
  { id: 'error', label: 'Errors', description: 'When a session fails.', enabled: false },
]
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h3 class="mb-1 text-lg font-semibold">Sounds</h3>
      <p class="text-sm text-muted-foreground">Audio cues for session activity.</p>
    </div>

    <!-- Sound pack -->
    <div class="space-y-2">
      <label
        v-for="option in PACKS"
        :key="option.id"
        :class="cn(
          'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors',
          pack === option.id ? 'border-foreground/20 bg-muted/50' : 'border-border hover:bg-muted/30',
        )"
      >
        <input v-model="pack" type="radio" :value="option.id" class="accent-foreground" />
        <div class="min-w-0 flex-1 leading-tight">
          <div class="text-sm font-medium">{{ option.label }}</div>
          <p class="mt-0.5 text-xs text-muted-foreground">{{ option.description }}</p>
        </div>
      </label>
    </div>

    <!-- Volume -->
    <div class="flex items-center gap-3 px-4">
      <Volume2 class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <input v-model.number="volume" type="range" min="0" max="100" class="h-1.5 flex-1 cursor-pointer accent-foreground" />
      <span class="w-8 text-right text-xs tabular-nums text-muted-foreground">{{ volume }}%</span>
    </div>

    <!-- Events -->
    <div class="divide-y rounded-2xl border">
      <div v-for="event in EVENTS" :key="event.id" class="flex items-center justify-between gap-4 px-4 py-3">
        <div class="min-w-0 flex-1">
          <div class="text-sm font-medium">{{ event.label }}</div>
          <p class="text-xs text-muted-foreground">{{ event.description }}</p>
        </div>
        <Switch :model-value="event.enabled" disabled />
      </div>
    </div>
  </div>
</template>
