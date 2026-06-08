<script setup lang="ts">
import { cn } from "../lib/utils"
import Card from "./Card.vue"

interface Props {
  title?: string
  count?: number
  description?: string
  tone?: "default" | "destructive"
  flush?: boolean
  class?: string
  bodyClass?: string
}
const props = withDefaults(defineProps<Props>(), { tone: "default", flush: false })

const destructive = props.tone === "destructive"
</script>
<template>
  <Card :class="cn('gap-0 overflow-hidden py-0', destructive && 'border-destructive/25', props.class)">
    <div v-if="title != null || description != null || $slots.action" class="flex items-start justify-between gap-3 border-b border-border/60 px-6 py-4">
      <div class="min-w-0">
        <h2 v-if="title != null" class="text-base font-semibold text-foreground">
          {{ title }}<span v-if="count != null" class="font-normal text-muted-foreground"> ({{ count }})</span>
        </h2>
        <p v-if="description != null" class="mt-0.5 text-xs text-muted-foreground">{{ description }}</p>
      </div>
      <div v-if="$slots.action" class="shrink-0"><slot name="action" /></div>
    </div>
    <slot v-if="flush" />
    <div v-else :class="cn('px-6 py-5', bodyClass)"><slot /></div>
  </Card>
</template>
