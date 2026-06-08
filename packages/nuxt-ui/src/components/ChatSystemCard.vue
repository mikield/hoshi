<script setup lang="ts">
import type { Component } from "vue"
import { cn } from "../lib/utils"

interface Props {
  icon?: Component
  label: string
  class?: string
}
const props = defineProps<Props>()
</script>
<template>
  <div :class="cn('rounded-2xl border border-border/60 bg-card/50 overflow-hidden', props.class)">
    <div class="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-muted/40">
      <component :is="icon" v-if="icon" class="size-3.5 text-muted-foreground/70" />
      <span class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">{{ label }}</span>
    </div>
    <div class="px-4 py-3 text-sm text-muted-foreground/90 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground/90">
      <slot />
    </div>
  </div>
</template>
