<script setup lang="ts">
import { ref } from "vue"
import { Loader2, ChevronRight, Wrench } from "lucide-vue-next"
import { cn } from "../lib/utils"
import Collapsible from "./Collapsible.vue"
import CollapsibleTrigger from "./CollapsibleTrigger.vue"
import CollapsibleContent from "./CollapsibleContent.vue"

// Folds a run of consecutive tool calls into one compact, expandable row.
// Collapsed it reads "N tool calls · read, grep, …"; expanded it reveals the
// individual rows (slot) behind a left rail, mirroring ThinkingBlock.
interface Props {
  count: number
  /** Short summary of what ran, e.g. "read ×3, grep ×2". */
  summary?: string
  /** A call in the group is still running. */
  running?: boolean
  defaultOpen?: boolean
  class?: string
}
const props = withDefaults(defineProps<Props>(), { running: false, defaultOpen: false })
const open = ref(props.defaultOpen)
</script>

<template>
  <Collapsible v-model:open="open">
    <CollapsibleTrigger as-child>
      <div :class="cn('group/toolgroup flex max-w-full cursor-pointer select-none items-center gap-1.5 py-0.5 text-xs text-muted-foreground/70 transition-colors hover:text-foreground', props.class)">
        <Wrench :class="cn('size-3.5 flex-shrink-0 text-muted-foreground/50', running && 'animate-pulse')" />
        <span class="flex-shrink-0 whitespace-nowrap">{{ count }} tool calls</span>
        <span v-if="summary" class="min-w-0 flex-1 truncate font-mono text-muted-foreground/50">{{ summary }}</span>
        <Loader2 v-if="running" class="size-3 flex-shrink-0 animate-spin text-muted-foreground/40" />
        <ChevronRight :class="cn('size-3 flex-shrink-0 text-muted-foreground/30 transition-transform', 'opacity-40 group-hover/toolgroup:opacity-80', open && 'rotate-90 opacity-100!')" />
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="mb-1.5 ml-[7px] mt-0.5 space-y-0.5 border-l border-border/30 pl-3">
        <slot />
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
