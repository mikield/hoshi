<script setup lang="ts">
import { computed } from "vue"
import { cn } from "../lib/utils"
import Avatar from "./Avatar.vue"
import AvatarImage from "./AvatarImage.vue"
import AvatarFallback from "./AvatarFallback.vue"

const SIZE_MAP = {
  xs: "size-5 text-xs",
  sm: "size-6 text-xs",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
  xl: "size-14 text-base",
} as const

export type UserAvatarSize = keyof typeof SIZE_MAP

interface Props {
  email: string
  name?: string | null
  avatarUrl?: string | null
  size?: UserAvatarSize
  class?: string
  ring?: boolean
}
const props = withDefaults(defineProps<Props>(), { size: "md", ring: false })

function initialsFromIdentity(name: string | undefined, email: string): string {
  const source = (name || "").trim()
  if (source) {
    const parts = source.split(/\s+/).filter(Boolean)
    const first = parts[0]?.[0] ?? ""
    const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : ""
    const out = (first + second).toUpperCase()
    if (out) return out
  }
  const local = email.split("@")[0] ?? email
  const segments = local.split(/[._-]+/).filter(Boolean)
  const first = segments[0]?.[0] ?? local[0] ?? "?"
  const second = segments[1]?.[0] ?? ""
  return (first + second).toUpperCase()
}

const initials = computed(() => initialsFromIdentity(props.name ?? undefined, props.email || ""))
</script>
<template>
  <Avatar :class="cn(SIZE_MAP[size], 'shrink-0 font-medium tracking-tight', ring && 'ring-background ring-2', props.class)">
    <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="name || email" />
    <AvatarFallback class="border border-border/70 bg-muted/40 font-semibold text-foreground/80">
      {{ initials || '?' }}
    </AvatarFallback>
  </Avatar>
</template>
