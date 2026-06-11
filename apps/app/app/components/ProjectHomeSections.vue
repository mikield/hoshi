<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowRight, Bot, Clock, Plug, Sparkles, Terminal, Users2 } from 'lucide-vue-next'
import type { CustomizeSection } from '~/composables/useCustomize'

const { show } = useCustomize()

/** Suna's project-home tiles, mapped to our Customize sections. */
const TILES: { section: CustomizeSection; icon: Component; title: string; description: string }[] = [
  { section: 'agents', icon: Bot, title: 'Agents', description: 'Pick and tune who does the work.' },
  { section: 'skills', icon: Sparkles, title: 'Skills', description: 'Teach the agent project-specific tricks.' },
  { section: 'commands', icon: Terminal, title: 'Commands', description: 'Reusable slash commands for this project.' },
  { section: 'connectors', icon: Plug, title: 'Connectors', description: 'Hook up the tools your agent can reach.' },
  { section: 'schedules', icon: Clock, title: 'Schedules', description: 'Run work on a timer, not on demand.' },
  { section: 'members', icon: Users2, title: 'Team', description: 'Who can work in this project.' },
]
</script>

<template>
  <div class="mx-auto mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <button
      v-for="tile in TILES"
      :key="tile.section"
      type="button"
      class="group relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 text-left transition-all hover:border-foreground/30 hover:bg-muted/30 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.18)]"
      @click="show(tile.section)"
    >
      <div class="flex items-center justify-between">
        <span class="flex size-8 items-center justify-center rounded-xl border border-border/60 bg-muted/40">
          <component :is="tile.icon" class="size-4 text-muted-foreground" />
        </span>
        <ArrowRight class="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div class="leading-tight">
        <div class="text-sm font-medium text-foreground">{{ tile.title }}</div>
        <p class="mt-0.5 text-xs text-muted-foreground">{{ tile.description }}</p>
      </div>
    </button>
  </div>
</template>
