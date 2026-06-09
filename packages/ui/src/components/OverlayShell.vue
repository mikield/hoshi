<script setup lang="ts">
import type { Component } from "vue"
import { SlidersHorizontal, X } from "lucide-vue-next"
import { cn } from "../lib/utils"
import Button from "./Button.vue"
import Dialog from "./Dialog.vue"
import DialogContent from "./DialogContent.vue"
import DialogTitle from "./DialogTitle.vue"

export interface OverlayNavItem {
  id: string
  label: string
  icon?: Component
  glyph?: string
}

export interface OverlayNavGroup {
  label?: string
  items: readonly OverlayNavItem[]
}

interface Props {
  open: boolean
  title: string
  subtitle?: string
  groups: readonly OverlayNavGroup[]
  footerGroup?: readonly OverlayNavItem[]
  active: string
  class?: string
}
const props = defineProps<Props>()
const emit = defineEmits<{ close: []; "active-change": [id: string] }>()

function itemClass(item: OverlayNavItem) {
  const isActive = item.id === props.active
  return cn(
    "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors text-left",
    isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
  )
}
</script>
<template>
  <Dialog :open="open" @update:open="(next: boolean) => !next && emit('close')">
    <DialogContent hide-close-button :class="cn('flex flex-col gap-0 overflow-hidden p-0 sm:max-w-[80vw] w-[80vw] h-[80vh]', props.class)">
      <DialogTitle class="sr-only">{{ title }}{{ subtitle ? ` · ${subtitle}` : '' }}</DialogTitle>
      <div class="flex items-center justify-between border-b border-border/60 px-6 py-4 flex-shrink-0">
        <div class="flex items-center gap-2 text-sm">
          <SlidersHorizontal class="size-4 text-muted-foreground" />
          <span class="font-semibold text-foreground">{{ title }}</span>
          <template v-if="subtitle">
            <span class="text-muted-foreground/40">·</span>
            <span class="text-muted-foreground">{{ subtitle }}</span>
          </template>
        </div>
        <Button variant="ghost" size="icon" aria-label="Close" @click="emit('close')">
          <X class="size-4" />
        </Button>
      </div>
      <div class="flex min-h-0 flex-1">
        <nav class="w-56 flex-shrink-0 border-r border-border/60 bg-muted/10 p-3 overflow-y-auto flex flex-col">
          <div class="space-y-4 flex-1">
            <div v-for="(group, i) in groups" :key="group.label ?? i">
              <div v-if="group.label" class="px-2.5 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">{{ group.label }}</div>
              <div class="space-y-0.5">
                <button v-for="item in group.items" :key="item.id" type="button" :class="itemClass(item)" @click="emit('active-change', item.id)">
                  <component :is="item.icon" v-if="item.icon" class="size-4 flex-shrink-0" />
                  <span v-else-if="item.glyph" class="size-4 flex-shrink-0 flex items-center justify-center font-mono text-xs">{{ item.glyph }}</span>
                  <span class="truncate">{{ item.label }}</span>
                </button>
              </div>
            </div>
          </div>
          <div v-if="footerGroup && footerGroup.length > 0" class="space-y-0.5 border-t border-border/40 pt-2">
            <button v-for="item in footerGroup" :key="item.id" type="button" :class="itemClass(item)" @click="emit('active-change', item.id)">
              <component :is="item.icon" v-if="item.icon" class="size-4 flex-shrink-0" />
              <span v-else-if="item.glyph" class="size-4 flex-shrink-0 flex items-center justify-center font-mono text-xs">{{ item.glyph }}</span>
              <span class="truncate">{{ item.label }}</span>
            </button>
          </div>
        </nav>
        <div class="flex-1 min-w-0 overflow-y-auto"><slot /></div>
      </div>
    </DialogContent>
  </Dialog>
</template>
