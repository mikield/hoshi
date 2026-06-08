<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from "vue"
import { cn } from "../lib/utils"
import Table from "./Table.vue"
import TableHeader from "./TableHeader.vue"
import TableBody from "./TableBody.vue"
import TableRow from "./TableRow.vue"
import TableHead from "./TableHead.vue"
import TableCell from "./TableCell.vue"
import Checkbox from "./Checkbox.vue"

export interface DataTableColumn<T> {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => any
  class?: string
  headerClass?: string
  width?: string
}

interface Props {
  columns: DataTableColumn<T>[]
  data: T[]
  class?: string
  emptyMessage?: string
  selectable?: boolean
  selectedItems?: T[]
  getItemId?: (item: T) => string
}

const props = withDefaults(defineProps<Props>(), {
  emptyMessage: "No data available",
  selectable: false,
  selectedItems: () => [],
})

const emit = defineEmits<{
  "row-click": [item: T]
  "selection-change": [items: T[]]
}>()

const isAllSelected = computed(() => props.selectable && props.data.length > 0 && props.selectedItems.length === props.data.length)
const isSomeSelected = computed(() => props.selectable && props.selectedItems.length > 0 && props.selectedItems.length < props.data.length)

function isItemSelected(item: T): boolean {
  if (!props.selectable || !props.getItemId) return false
  const itemId = props.getItemId(item)
  return props.selectedItems.some((selectedItem) => props.getItemId!(selectedItem) === itemId)
}

function handleSelectAll() {
  if (!props.selectable) return
  emit("selection-change", isAllSelected.value ? [] : props.data)
}

function handleSelectItem(item: T) {
  if (!props.selectable || !props.getItemId) return
  const itemId = props.getItemId(item)
  if (isItemSelected(item)) {
    emit("selection-change", props.selectedItems.filter((selectedItem) => props.getItemId!(selectedItem) !== itemId))
  } else {
    emit("selection-change", [...props.selectedItems, item])
  }
}

function handleRowClick(e: MouseEvent, item: T) {
  if ((e.target as HTMLElement).closest('[role="checkbox"]')) return
  emit("row-click", item)
}
</script>

<template>
  <div :class="cn('rounded-2xl border', props.class)">
    <div v-if="selectable && selectedItems.length > 0 && $slots.headerActions" class="flex items-center justify-between px-4 py-3 border-b">
      <span class="text-sm text-muted-foreground">{{ selectedItems.length }} item{{ selectedItems.length !== 1 ? 's' : '' }} selected</span>
      <div class="flex items-center gap-2"><slot name="headerActions" /></div>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-if="selectable" class="w-12">
            <Checkbox :model-value="isAllSelected || isSomeSelected" aria-label="Select all" @update:model-value="handleSelectAll" />
          </TableHead>
          <TableHead v-for="column in columns" :key="column.id" :class="cn(column.headerClass, column.width, 'text-muted-foreground font-semibold')">
            {{ column.header }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="data.length === 0">
          <TableCell :colspan="columns.length + (selectable ? 1 : 0)" class="text-center py-8 text-muted-foreground">
            {{ emptyMessage }}
          </TableCell>
        </TableRow>
        <TableRow
          v-for="(item, index) in data"
          :key="getItemId ? getItemId(item) : index"
          :class="cn($attrs.onRowClick !== undefined && 'cursor-pointer hover:bg-muted/50', selectable && isItemSelected(item) && 'bg-muted/50')"
          @click="handleRowClick($event, item)"
        >
          <TableCell v-if="selectable">
            <Checkbox :model-value="isItemSelected(item)" :aria-label="`Select item ${index + 1}`" @update:model-value="handleSelectItem(item)" />
          </TableCell>
          <TableCell v-for="column in columns" :key="column.id" :class="cn(column.class, column.width)">
            <component :is="{ render: () => column.cell!(item) }" v-if="column.cell" />
            <template v-else>{{ column.accessorKey ? String(item[column.accessorKey] ?? '') : '' }}</template>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
