<script setup lang="ts">
import { ref, computed } from "vue"
import type { Component } from "vue"
import { ChevronRight } from "lucide-vue-next"
import { cn } from "../lib/utils"
import Collapsible from "./Collapsible.vue"
import CollapsibleTrigger from "./CollapsibleTrigger.vue"
import CollapsibleContent from "./CollapsibleContent.vue"

interface Props {
  icon: Component
  tone?: "neutral" | "warning" | "error"
  class?: string
}
const props = withDefaults(defineProps<Props>(), { tone: "neutral" })

const TONE_ICON_CLASS = {
  neutral: "text-muted-foreground/50",
  warning: "text-amber-600 dark:text-amber-400",
  error: "text-destructive/50",
} as const

const open = ref(false)
const hasDetails = computed(() => true)
</script>
<template>
  <Collapsible v-if="$slots.default" v-model:open="open">
    <CollapsibleTrigger as-child>
      <div
        :class="cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl',
          'bg-muted/20 border border-border/40',
          'text-xs select-none max-w-full cursor-pointer hover:bg-muted/40 transition-colors',
          props.class
        )"
      >
        <component :is="icon" :class="cn('size-3.5 flex-shrink-0', TONE_ICON_CLASS[tone])" />
        <span class="text-muted-foreground/70 truncate"><slot name="label" /></span>
        <ChevronRight :class="cn('size-3 text-muted-foreground/30 transition-transform flex-shrink-0 ml-auto', open && 'rotate-90')" />
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="px-3 py-2 text-xs space-y-1 border border-t-0 border-border/40 rounded-b-lg bg-muted/10">
        <slot />
      </div>
    </CollapsibleContent>
  </Collapsible>
  <div
    v-else
    :class="cn(
      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl',
      'bg-muted/20 border border-border/40',
      'text-xs select-none max-w-full',
      props.class
    )"
  >
    <component :is="icon" :class="cn('size-3.5 flex-shrink-0', TONE_ICON_CLASS[tone])" />
    <span class="text-muted-foreground/70 truncate"><slot name="label" /></span>
  </div>
</template>
