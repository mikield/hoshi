<script setup lang="ts">
import { computed } from "vue"
import type { Component } from "vue"
import { cn } from "../lib/utils"

const SIZE_MAP = {
  xs: { box: "size-5 rounded-[5px] text-xs", icon: "h-3 w-3" },
  sm: { box: "size-6 rounded-md text-xs", icon: "h-3.5 w-3.5" },
  md: { box: "size-8 rounded-lg text-xs", icon: "h-4 w-4" },
  lg: { box: "size-10 rounded-lg text-sm", icon: "h-5 w-5" },
  xl: { box: "size-14 rounded-xl text-base", icon: "h-7 w-7" },
} as const

export type EntityAvatarSize = keyof typeof SIZE_MAP

interface Props {
  label?: string
  icon?: Component
  size?: EntityAvatarSize
  class?: string
}
const props = withDefaults(defineProps<Props>(), { size: "md" })

const sizes = computed(() => SIZE_MAP[props.size])
const initial = computed(() => (props.label?.trim()?.charAt(0) || "?").toUpperCase())
</script>
<template>
  <span data-slot="entity-avatar" :class="cn('inline-flex shrink-0 items-center justify-center border border-border/70 bg-muted/40 font-semibold text-foreground/80', sizes.box, props.class)">
    <component :is="icon" v-if="icon" :class="cn(sizes.icon, 'text-muted-foreground')" />
    <template v-else>{{ initial }}</template>
  </span>
</template>
