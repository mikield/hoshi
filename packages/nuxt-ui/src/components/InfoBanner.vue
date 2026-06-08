<script setup lang="ts">
import type { Component } from "vue"
import { cn } from "../lib/utils"
import { bannerVariants, ICON_TONE, type BannerVariants } from "./info-banner"

interface Props {
  tone?: BannerVariants["tone"]
  icon?: Component
  title?: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { tone: "neutral" })
const safeTone = props.tone ?? "neutral"
</script>
<template>
  <div :class="cn(bannerVariants({ tone }), props.class)">
    <component :is="icon" v-if="icon" :class="cn('mt-0.5 h-4 w-4 shrink-0', ICON_TONE[safeTone as string])" />
    <div class="min-w-0 flex-1">
      <p v-if="title != null" class="font-medium text-foreground">{{ title }}</p>
      <div v-if="$slots.default" :class="cn('text-xs text-muted-foreground', title != null && 'mt-0.5')">
        <slot />
      </div>
    </div>
    <div v-if="$slots.action" class="shrink-0"><slot name="action" /></div>
  </div>
</template>
