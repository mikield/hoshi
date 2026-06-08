<script setup lang="ts">
import { computed } from "vue"
import { WifiOff, RefreshCw } from "lucide-vue-next"
import { cn } from "../lib/utils"

export type ConnectionPillStatus = "connecting" | "reconnecting" | "degraded" | "unreachable"

interface Props {
  status: ConnectionPillStatus
  label: string
  detail?: string
  class?: string
}
const props = defineProps<Props>()

const STATUS_CONFIG = {
  connecting: { icon: RefreshCw, pulse: true, iconClass: "text-amber-500 dark:text-amber-400", dotClass: "bg-amber-500 dark:bg-amber-400" },
  reconnecting: { icon: RefreshCw, pulse: true, iconClass: "text-amber-500 dark:text-amber-400", dotClass: "bg-amber-500 dark:bg-amber-400" },
  degraded: { icon: RefreshCw, pulse: false, iconClass: "text-amber-500 dark:text-amber-400", dotClass: "bg-amber-500 dark:bg-amber-400" },
  unreachable: { icon: WifiOff, pulse: false, iconClass: "text-destructive/70", dotClass: "bg-destructive/70" },
} as const

const config = computed(() => STATUS_CONFIG[props.status])
</script>
<template>
  <div :class="cn('inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/95 backdrop-blur-sm px-3 py-1.5 shadow-lg text-xs', props.class)">
    <span class="relative flex size-2 flex-shrink-0">
      <span v-if="config.pulse" :class="cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', config.dotClass)" />
      <span :class="cn('relative inline-flex size-2 rounded-full', config.dotClass)" />
    </span>
    <component :is="config.icon" :class="cn('size-3.5 flex-shrink-0', config.iconClass, status !== 'unreachable' && 'animate-spin [animation-duration:2s]')" />
    <span class="font-medium text-foreground">{{ label }}</span>
    <span v-if="detail" class="text-muted-foreground/60">{{ detail }}</span>
  </div>
</template>
