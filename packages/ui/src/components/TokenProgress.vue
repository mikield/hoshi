<script setup lang="ts">
import { computed } from "vue"
import { cn } from "../lib/utils"
import CircularProgress from "./CircularProgress.vue"
import Tooltip from "./Tooltip.vue"
import TooltipTrigger from "./TooltipTrigger.vue"
import TooltipContent from "./TooltipContent.vue"

const props = defineProps<{
  used: number
  limit: number
}>()

const fraction = computed(() => (props.limit > 0 ? props.used / props.limit : 0))
const percent = computed(() => Math.min(100, Math.round(fraction.value * 100)))

function compact(n: number): string {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n)
}
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <span class="flex size-8 cursor-default items-center justify-center">
        <CircularProgress
          :value="fraction"
          :class="cn('size-5', percent >= 90 ? 'text-destructive' : percent >= 70 ? 'text-amber-500' : 'text-muted-foreground')"
        />
      </span>
    </TooltipTrigger>
    <TooltipContent side="top">
      Context: {{ compact(used) }} / {{ compact(limit) }} tokens ({{ percent }}%)
    </TooltipContent>
  </Tooltip>
</template>
