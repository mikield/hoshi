<script setup lang="ts">
import { ref, computed } from "vue"
import { Check, ChevronDown, Cpu } from "lucide-vue-next"
import { cn } from "../lib/utils"
import CommandPopover from "./CommandPopover.vue"
import CommandPopoverTrigger from "./CommandPopoverTrigger.vue"
import CommandPopoverContent from "./CommandPopoverContent.vue"
import CommandInput from "./CommandInput.vue"
import CommandList from "./CommandList.vue"
import CommandGroup from "./CommandGroup.vue"
import CommandItem from "./CommandItem.vue"
import Badge from "./Badge.vue"

export interface ModelItem {
  providerID: string
  providerName: string
  modelID: string
  name: string
  /** True when the provider charges nothing for this model. */
  free?: boolean
}

const props = defineProps<{ models: ModelItem[] }>()

/** "providerID/modelID" key of the active model. */
const selected = defineModel<string | null>({ default: null })

const open = ref(false)

const byProvider = computed(() => {
  const groups = new Map<string, ModelItem[]>()
  for (const model of props.models) {
    const list = groups.get(model.providerName) ?? []
    list.push(model)
    groups.set(model.providerName, list)
  }
  return [...groups.entries()]
})

const active = computed(() => props.models.find((m) => modelKey(m) === selected.value) ?? null)

function modelKey(model: ModelItem): string {
  return `${model.providerID}/${model.modelID}`
}

function pick(model: ModelItem) {
  selected.value = modelKey(model)
  open.value = false
}
</script>

<template>
  <CommandPopover v-model:open="open">
    <CommandPopoverTrigger as-child>
      <button
        type="button"
        aria-label="Model picker"
        title="Switch model"
        :class="cn(
          'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground',
          open && 'bg-muted text-foreground',
        )"
      >
        <Cpu class="size-3.5" />
        <span class="max-w-[120px] truncate">{{ active?.name ?? 'Model' }}</span>
        <ChevronDown :class="cn('size-3 opacity-50 transition-transform duration-200', open && 'rotate-180')" />
      </button>
    </CommandPopoverTrigger>

    <CommandPopoverContent side="top" align="start" :side-offset="8" should-filter class="w-[300px]">
      <CommandInput compact placeholder="Search models…" />
      <CommandList class="max-h-[380px]">
        <CommandGroup v-for="[provider, list] in byProvider" :key="provider" :heading="`${provider} · ${list.length}`">
          <CommandItem
            v-for="model in list"
            :key="modelKey(model)"
            :value="`${model.name} ${modelKey(model)}`"
            :class="modelKey(model) === selected ? 'bg-foreground/[0.06]' : undefined"
            @select="pick(model)"
          >
            <div class="min-w-0 flex-1 py-0.5">
              <div class="flex items-center gap-1.5">
                <span
                  :class="cn(
                    'truncate text-sm leading-tight',
                    modelKey(model) === selected ? 'font-semibold text-foreground' : 'font-medium text-foreground/90',
                  )"
                >
                  {{ model.name }}
                </span>
                <Badge v-if="model.free" variant="secondary" class="h-4 shrink-0 px-1.5 text-[10px]">Free</Badge>
              </div>
              <p class="mt-1 truncate font-mono text-xs leading-snug text-muted-foreground/55">{{ model.modelID }}</p>
            </div>
            <Check v-if="modelKey(model) === selected" class="shrink-0 text-foreground" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandPopoverContent>
  </CommandPopover>
</template>
