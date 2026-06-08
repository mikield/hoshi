<script setup lang="ts">
import type { Component } from "vue"
import { cn } from "../lib/utils"
import Button from "./Button.vue"
import Tooltip from "./Tooltip.vue"
import TooltipContent from "./TooltipContent.vue"
import TooltipTrigger from "./TooltipTrigger.vue"

export interface ChatMessageAction {
  icon: Component
  label: string
  onClick?: () => void
}

interface Props {
  actions: ChatMessageAction[]
  class?: string
}
const props = defineProps<Props>()
</script>
<template>
  <div
    v-if="actions.length > 0"
    :class="cn('flex items-center gap-0.5 opacity-0 group-hover/turn:opacity-100 transition-opacity duration-150', props.class)"
  >
    <Tooltip v-for="(action, i) in actions" :key="i">
      <TooltipTrigger as-child>
        <Button variant="ghost" size="icon-xs" class="text-muted-foreground/50" @click="action.onClick?.()">
          <component :is="action.icon" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" class="text-xs">{{ action.label }}</TooltipContent>
    </Tooltip>
  </div>
</template>
