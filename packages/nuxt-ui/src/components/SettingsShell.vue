<script setup lang="ts">
import type { Component } from "vue"
import { cn } from "../lib/utils"
import Dialog from "./Dialog.vue"
import DialogContent from "./DialogContent.vue"

export interface SettingsGroup {
  label: string
  items: { id: string; label: string; icon: Component }[]
}

interface Props {
  open: boolean
  groups: SettingsGroup[]
  active: string
  title?: string
  class?: string
}
const props = withDefaults(defineProps<Props>(), { title: "Settings" })
const emit = defineEmits<{ "update:open": [open: boolean]; "active-change": [id: string] }>()
</script>
<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent :class="cn('flex flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl h-[32rem]', props.class)">
      <div class="flex min-h-0 flex-1">
        <nav class="w-56 flex-shrink-0 border-r border-border/60 bg-muted/20 p-3 overflow-y-auto">
          <div class="px-2 pb-2 text-sm font-semibold text-foreground">{{ title }}</div>
          <div class="space-y-4">
            <div v-for="group in groups" :key="group.label">
              <div class="px-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">{{ group.label }}</div>
              <div class="space-y-0.5">
                <button
                  v-for="item in group.items"
                  :key="item.id"
                  type="button"
                  :class="cn(
                    'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors text-left',
                    item.id === active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  )"
                  @click="emit('active-change', item.id)"
                >
                  <component :is="item.icon" class="size-4 flex-shrink-0" />
                  <span class="truncate">{{ item.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div class="flex-1 overflow-y-auto p-6"><slot /></div>
      </div>
    </DialogContent>
  </Dialog>
</template>
