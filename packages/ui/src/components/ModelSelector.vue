<script setup lang="ts">
import { computed } from "vue"
import { Check, Cpu } from "lucide-vue-next"
import { cn } from "../lib/utils"
import DropdownMenu from "./DropdownMenu.vue"
import DropdownMenuTrigger from "./DropdownMenuTrigger.vue"
import DropdownMenuContent from "./DropdownMenuContent.vue"
import DropdownMenuItem from "./DropdownMenuItem.vue"

export interface ModelItem {
  providerID: string
  providerName: string
  modelID: string
  name: string
}

const props = defineProps<{ models: ModelItem[] }>()

/** "providerID/modelID" key of the active model. */
const selected = defineModel<string | null>({ default: null })

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
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        class="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
      >
        <Cpu class="size-3.5" />
        <span class="max-w-36 truncate">{{ active?.name ?? 'Model' }}</span>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" side="top" :side-offset="8" class="w-72 overflow-hidden rounded-2xl border-border/60 p-0">
      <div class="max-h-80 overflow-y-auto py-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <template v-for="[provider, list] in byProvider" :key="provider">
          <div class="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground/50 first:pt-1">
            {{ provider }}
          </div>
          <div class="px-1">
            <DropdownMenuItem
              v-for="model in list"
              :key="modelKey(model)"
              :class="cn('flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-0', modelKey(model) === selected && 'bg-muted/60')"
              @select="selected = modelKey(model)"
            >
              <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ model.name }}</span>
              <Check v-if="modelKey(model) === selected" class="size-3.5 shrink-0 text-foreground/70" />
            </DropdownMenuItem>
          </div>
        </template>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
