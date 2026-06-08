<script setup lang="ts">
import { ref } from "vue"
import { Scissors, ChevronDown } from "lucide-vue-next"
import { cn } from "../lib/utils"
import Button from "./Button.vue"
import Badge from "./Badge.vue"
import type { BadgeVariants } from "./badge"

export interface ContextEventStat {
  label: string
  variant?: BadgeVariants["variant"]
}

interface Props {
  label: string
  stats?: ContextEventStat[]
  class?: string
}
const props = withDefaults(defineProps<Props>(), { stats: () => [] })
const expanded = ref(false)
</script>
<template>
  <div :class="cn('rounded-2xl border border-border/60 bg-card/50 overflow-hidden', props.class)">
    <Button
      type="button"
      variant="ghost"
      :class="cn('flex items-center gap-2 w-full px-3 py-2 h-auto border-b border-border/40 bg-muted/30 rounded-none justify-start', !$slots.default && 'pointer-events-none')"
      @click="$slots.default && (expanded = !expanded)"
    >
      <Scissors class="size-3.5 text-muted-foreground/70 flex-shrink-0" />
      <span class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">{{ label }}</span>
      <div class="flex items-center gap-1.5 ml-auto">
        <Badge v-for="(s, i) in stats" :key="i" :variant="s.variant ?? 'secondary'" size="sm">{{ s.label }}</Badge>
        <ChevronDown v-if="$slots.default" :class="cn('size-3 text-muted-foreground/50 transition-transform', expanded && 'rotate-180')" />
      </div>
    </Button>
    <div v-if="expanded && $slots.default" class="px-3 py-2 space-y-2 text-xs text-muted-foreground/80">
      <slot />
    </div>
  </div>
</template>
