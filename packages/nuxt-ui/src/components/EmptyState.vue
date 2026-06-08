<script setup lang="ts">
import type { Component } from "vue"
import { cn } from "../lib/utils"

interface Props {
  icon?: Component
  title: string
  class?: string
  size?: "sm" | "default"
}
const props = withDefaults(defineProps<Props>(), { size: "default" })

const iconSize = props.size === "sm" ? "h-8 w-8" : "h-10 w-10"
const maxW = props.size === "sm" ? "max-w-[240px]" : "max-w-[320px]"
</script>
<template>
  <div :class="cn('flex flex-1 items-center justify-center px-6 py-12', props.class)">
    <div :class="cn('text-center', maxW)">
      <div v-if="icon" class="flex justify-center mb-4">
        <component :is="icon" :class="cn(iconSize, 'text-muted-foreground/20')" :stroke-width="1.25" />
      </div>
      <h3 class="text-sm font-semibold text-foreground tracking-tight">{{ title }}</h3>
      <p v-if="$slots.description" class="mt-1.5 text-sm text-muted-foreground/80 leading-relaxed">
        <slot name="description" />
      </p>
      <div v-if="$slots.action || $slots.secondaryAction" class="mt-5 flex items-center justify-center gap-2">
        <slot name="action" />
        <slot name="secondaryAction" />
      </div>
    </div>
  </div>
</template>
