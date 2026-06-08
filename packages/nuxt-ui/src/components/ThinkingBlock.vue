<script setup lang="ts">
import { ref } from "vue"
import { Brain, Loader2, ChevronRight } from "lucide-vue-next"
import { cn } from "../lib/utils"
import Collapsible from "./Collapsible.vue"
import CollapsibleTrigger from "./CollapsibleTrigger.vue"
import CollapsibleContent from "./CollapsibleContent.vue"

interface Props {
  preview?: string
  streaming?: boolean
  defaultOpen?: boolean
  class?: string
}
const props = withDefaults(defineProps<Props>(), { streaming: false, defaultOpen: false })
const open = ref(props.defaultOpen)
</script>
<template>
  <Collapsible v-if="$slots.default" v-model:open="open">
    <CollapsibleTrigger as-child>
      <div :class="cn('flex items-center gap-1.5 py-0.5 text-xs select-none cursor-pointer text-muted-foreground/70 transition-colors max-w-full group/reasoning', props.class)">
        <Brain :class="cn('size-3.5 flex-shrink-0 text-muted-foreground/50', streaming && 'animate-pulse')" />
        <span class="min-w-0 flex-1 truncate">{{ preview || 'Thinking' }}</span>
        <Loader2 v-if="streaming" class="size-3 animate-spin flex-shrink-0 text-muted-foreground/40" />
        <ChevronRight :class="cn('size-3 transition-transform flex-shrink-0 text-muted-foreground/30', 'opacity-0 group-hover/reasoning:opacity-100', open && 'rotate-90 opacity-100')" />
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="ml-[18px] mt-0.5 mb-1.5 pl-3 border-l border-border/30">
        <div class="space-y-2 text-xs leading-[1.5] text-muted-foreground/50 italic">
          <slot />
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
  <div v-else :class="cn('flex items-center gap-1.5 py-0.5 text-xs select-none cursor-pointer text-muted-foreground/70 transition-colors max-w-full group/reasoning', props.class)">
    <Brain :class="cn('size-3.5 flex-shrink-0 text-muted-foreground/50', streaming && 'animate-pulse')" />
    <span class="min-w-0 flex-1 truncate">{{ preview || 'Thinking' }}</span>
    <Loader2 v-if="streaming" class="size-3 animate-spin flex-shrink-0 text-muted-foreground/40" />
    <ChevronRight class="size-3 transition-transform flex-shrink-0 text-muted-foreground/30 opacity-0 group-hover/reasoning:opacity-100" />
  </div>
</template>
