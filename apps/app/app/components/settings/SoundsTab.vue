<script setup lang="ts">
import { Button, Switch } from '@hoshi/ui'
import { CircleAlert, MessageCircleQuestion, Play, Sparkles, Volume2 } from 'lucide-vue-next'
import { playChime, type ChimeKind } from '~/composables/useChime'

const { prefs } = storeToRefs(useAlertsStore())

function preview(kind: ChimeKind) {
  playChime(kind, prefs.value.volume / 100)
}
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h3 class="mb-1 text-lg font-semibold">Sounds</h3>
      <p class="text-sm text-muted-foreground">Audio cues when a session finishes or fails out of view.</p>
    </div>

    <!-- Master toggle -->
    <div class="rounded-2xl border p-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-1 items-start gap-3">
          <Volume2 class="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div class="flex-1 space-y-0.5">
            <div class="text-sm font-medium">Enable sounds</div>
            <p class="text-xs text-muted-foreground">Soft synthesized chimes — nothing plays for the session you're watching.</p>
          </div>
        </div>
        <Switch v-model="prefs.sounds" aria-label="Enable sounds" />
      </div>
    </div>

    <!-- Volume -->
    <div class="flex items-center gap-3 px-4" :class="!prefs.sounds && 'opacity-50'">
      <Volume2 class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <input
        v-model.number="prefs.volume"
        type="range"
        min="0"
        max="100"
        :disabled="!prefs.sounds"
        class="h-1.5 flex-1 cursor-pointer accent-foreground"
        aria-label="Volume"
      />
      <span class="w-8 text-right text-xs tabular-nums text-muted-foreground">{{ prefs.volume }}%</span>
    </div>

    <!-- Events -->
    <div class="divide-y rounded-2xl border" :class="!prefs.sounds && 'opacity-50'">
      <div class="flex items-center justify-between gap-4 px-4 py-3">
        <div class="flex min-w-0 flex-1 items-start gap-3">
          <Sparkles class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium">Session finished</div>
            <p class="text-xs text-muted-foreground">When the agent completes a turn.</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="size-7 text-muted-foreground hover:text-foreground"
          aria-label="Preview finish sound"
          @click="preview('complete')"
        >
          <Play class="size-3.5" />
        </Button>
        <Switch v-model="prefs.soundComplete" :disabled="!prefs.sounds" aria-label="Sound when a session finishes" />
      </div>
      <div class="flex items-center justify-between gap-4 px-4 py-3">
        <div class="flex min-w-0 flex-1 items-start gap-3">
          <MessageCircleQuestion class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium">Needs your input</div>
            <p class="text-xs text-muted-foreground">When the agent asks a question.</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="size-7 text-muted-foreground hover:text-foreground"
          aria-label="Preview input sound"
          @click="preview('input')"
        >
          <Play class="size-3.5" />
        </Button>
        <Switch v-model="prefs.soundInput" :disabled="!prefs.sounds" aria-label="Sound when the agent needs input" />
      </div>
      <div class="flex items-center justify-between gap-4 px-4 py-3">
        <div class="flex min-w-0 flex-1 items-start gap-3">
          <CircleAlert class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium">Errors</div>
            <p class="text-xs text-muted-foreground">When a session fails.</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="size-7 text-muted-foreground hover:text-foreground"
          aria-label="Preview error sound"
          @click="preview('error')"
        >
          <Play class="size-3.5" />
        </Button>
        <Switch v-model="prefs.soundError" :disabled="!prefs.sounds" aria-label="Sound on errors" />
      </div>
    </div>
  </div>
</template>
