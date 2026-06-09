<script setup lang="ts">
import { ref } from "vue"
import { Loader2, ChevronRight } from "lucide-vue-next"
import { cn } from "../lib/utils"
import Collapsible from "./Collapsible.vue"
import CollapsibleTrigger from "./CollapsibleTrigger.vue"
import CollapsibleContent from "./CollapsibleContent.vue"

export type ToolCallStatus = "running" | "completed" | "error"

interface Props {
  title: string
  subtitle?: string
  status?: ToolCallStatus
  defaultOpen?: boolean
  class?: string
}
const props = withDefaults(defineProps<Props>(), { status: "completed", defaultOpen: false })
const open = ref(props.defaultOpen)
const running = props.status === "running"
</script>
<template>
  <Collapsible v-if="$slots.default" v-model:open="open">
    <CollapsibleTrigger as-child>
      <div :class="cn('flex items-center gap-1.5 py-0.5 text-xs text-muted-foreground/70 transition-colors select-none max-w-full group', '[&>span:first-child>svg]:size-3.5 [&>span:first-child>svg]:text-muted-foreground/50', 'cursor-pointer', props.class)">
        <span class="flex-shrink-0"><slot name="icon" /></span>
        <span class="text-xs whitespace-nowrap flex-shrink-0">{{ title }}</span>
        <span v-if="subtitle" class="text-muted-foreground text-xs truncate font-mono min-w-0 flex-1">{{ subtitle }}</span>
        <Loader2 v-if="running" class="size-3 animate-spin text-muted-foreground/40 flex-shrink-0" />
        <ChevronRight :class="cn('size-3 transition-all flex-shrink-0 text-muted-foreground/30', 'opacity-40 group-hover:opacity-80', open && 'rotate-90 !opacity-100')" />
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="mt-1 mb-1 px-3 py-2 text-xs font-mono text-muted-foreground/60 border border-border/40 rounded-lg bg-muted/10 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
        <slot />
      </div>
    </CollapsibleContent>
  </Collapsible>
  <div v-else :class="cn('flex items-center gap-1.5 py-0.5 text-xs text-muted-foreground/70 transition-colors select-none max-w-full group', '[&>span:first-child>svg]:size-3.5 [&>span:first-child>svg]:text-muted-foreground/50', props.class)">
    <span class="flex-shrink-0"><slot name="icon" /></span>
    <span class="text-xs whitespace-nowrap flex-shrink-0">{{ title }}</span>
    <span v-if="subtitle" class="text-muted-foreground text-xs truncate font-mono min-w-0 flex-1">{{ subtitle }}</span>
    <Loader2 v-if="running" class="size-3 animate-spin text-muted-foreground/40 flex-shrink-0" />
  </div>
</template>
