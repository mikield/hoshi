<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { Check, ChevronDown } from "lucide-vue-next"
import { cn } from "../lib/utils"
import CommandPopover from "./CommandPopover.vue"
import CommandPopoverTrigger from "./CommandPopoverTrigger.vue"
import CommandPopoverContent from "./CommandPopoverContent.vue"
import CommandInput from "./CommandInput.vue"
import CommandList from "./CommandList.vue"
import CommandGroup from "./CommandGroup.vue"
import CommandItem from "./CommandItem.vue"
import Tooltip from "./Tooltip.vue"
import TooltipTrigger from "./TooltipTrigger.vue"
import TooltipContent from "./TooltipContent.vue"

export interface AgentItem {
  name: string
  description?: string
}

const props = defineProps<{ agents: AgentItem[] }>()

const selected = defineModel<string | null>({ default: null })

const open = ref(false)
const flash = ref(false)

const current = computed(
  () => props.agents.find((agent) => agent.name === selected.value) ?? props.agents[0],
)

// Flash highlight when the agent changes from outside (e.g. an @mention).
watch(selected, (next, prev) => {
  if (prev !== null && next !== prev) {
    flash.value = true
    setTimeout(() => (flash.value = false), 400)
  }
})

function pick(name: string) {
  selected.value = name
  open.value = false
}
</script>

<template>
  <CommandPopover v-model:open="open">
    <Tooltip>
      <TooltipTrigger as-child>
        <CommandPopoverTrigger as-child>
          <button
            type="button"
            aria-label="Agent picker"
            :class="cn(
              'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-medium capitalize text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground',
              flash && 'bg-primary/10 text-foreground',
              open && 'bg-muted text-foreground',
            )"
          >
            <span class="max-w-[100px] truncate">{{ current?.name ?? 'Agent' }}</span>
            <ChevronDown :class="cn('size-3 opacity-50 transition-transform duration-200', open && 'rotate-180')" />
          </button>
        </CommandPopoverTrigger>
      </TooltipTrigger>
      <TooltipContent side="top" class="text-xs">Switch agent</TooltipContent>
    </Tooltip>

    <CommandPopoverContent side="top" align="start" :side-offset="8" class="w-[300px]">
      <CommandInput compact placeholder="Search agents…" />
      <CommandList class="max-h-[320px]">
        <CommandGroup heading="Agents">
          <CommandItem
            v-for="agent in agents"
            :key="agent.name"
            :value="agent.name"
            :class="agent.name === current?.name ? 'bg-foreground/[0.06]' : undefined"
            @select="pick(agent.name)"
          >
            <div class="min-w-0 flex-1 py-0.5">
              <div
                :class="cn(
                  'truncate text-sm capitalize leading-tight',
                  agent.name === current?.name ? 'font-semibold text-foreground' : 'font-medium text-foreground/90',
                )"
              >
                {{ agent.name }}
              </div>
              <p v-if="agent.description" class="mt-1 truncate text-xs leading-snug text-muted-foreground/55">{{ agent.description }}</p>
            </div>
            <Check v-if="agent.name === current?.name" class="shrink-0 text-foreground" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandPopoverContent>
  </CommandPopover>
</template>
