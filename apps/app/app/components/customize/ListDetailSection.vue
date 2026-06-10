<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Component } from 'vue'
import { Input, EmptyState, cn } from '@hoshi/ui'
import { Search } from 'lucide-vue-next'

// Shared two-pane shell for the Build sections (Agents / Skills / Commands):
// a searchable list on the left, the selected item's detail on the right.
export interface ListDetailItem {
  id: string
  label: string
  sublabel?: string
}

const props = defineProps<{
  icon: Component
  title: string
  items: ListDetailItem[]
  searchPlaceholder?: string
}>()

const selectedId = ref<string | null>(null)
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter(
    (item) => item.label.toLowerCase().includes(q) || item.sublabel?.toLowerCase().includes(q),
  )
})

const selected = computed(() => props.items.find((item) => item.id === selectedId.value) ?? null)

// Keep a sane selection: first item by default, clear if it disappears.
watch(
  () => props.items,
  (items) => {
    if (!items.some((item) => item.id === selectedId.value)) {
      selectedId.value = items[0]?.id ?? null
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex h-full min-h-0">
    <!-- List pane -->
    <div class="flex w-72 shrink-0 flex-col border-r border-border/60">
      <CustomizeSectionHeader :icon="icon" :title="title" :count="items.length">
        <template #actions><slot name="actions" /></template>
      </CustomizeSectionHeader>
      <div class="border-b border-border/40 px-3 py-2.5">
        <div class="relative">
          <Search class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <Input v-model="query" :placeholder="searchPlaceholder ?? 'Search…'" class="h-8 pl-8" />
        </div>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto px-2 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div v-if="filtered.length === 0" class="px-2 py-6 text-center text-xs text-muted-foreground/60">
          Nothing matches "{{ query }}"
        </div>
        <ul v-else class="space-y-0.5">
          <li v-for="item in filtered" :key="item.id">
            <button
              type="button"
              :class="cn(
                'group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors',
                item.id === selectedId ? 'bg-muted/70 text-foreground' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
              )"
              @click="selectedId = item.id"
            >
              <slot name="row" :item="item">
                <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ item.label }}</span>
              </slot>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Detail pane -->
    <div class="min-h-0 min-w-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <slot v-if="selected" name="detail" :item="selected" />
      <EmptyState v-else :icon="icon" :title="`No ${title.toLowerCase()} yet`" class="h-full" />
    </div>
  </div>
</template>
