<script setup lang="ts">
import { ref, computed } from "vue"
import { MessageSquare, ChevronDown } from "lucide-vue-next"
import { cn } from "../lib/utils"
import Collapsible from "./Collapsible.vue"
import CollapsibleTrigger from "./CollapsibleTrigger.vue"
import CollapsibleContent from "./CollapsibleContent.vue"
import Button from "./Button.vue"

export interface QuestionsCardItem {
  question: string
  answer: string
}

interface Props {
  items: QuestionsCardItem[]
  defaultExpanded?: boolean
  class?: string
}
const props = withDefaults(defineProps<Props>(), { defaultExpanded: false })
const expanded = ref(props.defaultExpanded)
const answeredCount = computed(() => props.items.filter((i) => i.answer).length)
</script>
<template>
  <Collapsible v-model:open="expanded">
    <div :class="cn('rounded-2xl border border-border/40 bg-muted/20 overflow-hidden', props.class)">
      <CollapsibleTrigger as-child>
        <Button type="button" variant="ghost" class="flex items-center gap-1.5 w-full px-2.5 py-1.5 h-auto text-left rounded-none justify-start hover:bg-muted/40">
          <MessageSquare class="size-3.5 text-muted-foreground shrink-0" />
          <span class="text-xs font-medium text-foreground">Questions</span>
          <span class="text-xs text-muted-foreground/70">{{ answeredCount }} answered</span>
          <ChevronDown :class="cn('size-3 text-muted-foreground ml-auto transition-transform', expanded && 'rotate-180')" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div class="border-t border-border/30">
          <div v-for="(item, i) in items" :key="i" class="px-2.5 py-2 border-b border-border/30 last:border-b-0">
            <div class="text-xs text-muted-foreground/70 leading-relaxed">{{ item.question }}</div>
            <div class="text-sm font-medium text-foreground mt-0.5">{{ item.answer || 'No answer' }}</div>
          </div>
        </div>
      </CollapsibleContent>
    </div>
  </Collapsible>
</template>
