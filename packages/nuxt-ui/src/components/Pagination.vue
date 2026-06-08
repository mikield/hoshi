<script setup lang="ts">
import { ref, computed } from "vue"
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronsLeft, ChevronsRight } from "lucide-vue-next"
import Button from "./Button.vue"
import Input from "./Input.vue"
import Select from "./Select.vue"
import SelectContent from "./SelectContent.vue"
import SelectItem from "./SelectItem.vue"
import SelectTrigger from "./SelectTrigger.vue"
import SelectValue from "./SelectValue.vue"

interface Props {
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize: number
  isLoading?: boolean
  showPageSizeSelector?: boolean
  showJumpToPage?: boolean
  showResultsInfo?: boolean
  pageSizeOptions?: number[]
  position?: "top" | "bottom" | "standalone"
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  showPageSizeSelector: true,
  showJumpToPage: true,
  showResultsInfo: true,
  pageSizeOptions: () => [10, 20, 50, 100],
  position: "standalone",
})

const emit = defineEmits<{
  "page-change": [page: number]
  "page-size-change": [pageSize: number]
}>()

const jumpToPageInput = ref("")

const visiblePages = computed(() => {
  const delta = 1
  const range: number[] = []
  const rangeWithDots: (number | string)[] = []

  rangeWithDots.push(1)

  if (props.currentPage - delta > 2) {
    rangeWithDots.push("...")
  }

  for (let i = Math.max(2, props.currentPage - delta); i <= Math.min(props.totalPages - 1, props.currentPage + delta); i++) {
    if (i !== 1 && i !== props.totalPages) {
      range.push(i)
    }
  }
  rangeWithDots.push(...range)

  if (props.currentPage + delta < props.totalPages - 1) {
    rangeWithDots.push("...")
  }

  if (props.totalPages > 1) {
    rangeWithDots.push(props.totalPages)
  }

  return rangeWithDots.filter((page, index, arr) => arr.indexOf(page) === index)
})

function handleJumpToPage() {
  const pageNum = parseInt(jumpToPageInput.value)
  if (pageNum >= 1 && pageNum <= props.totalPages) {
    emit("page-change", pageNum)
    jumpToPageInput.value = ""
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    handleJumpToPage()
  }
}

const safeCurrentPage = computed(() => Number(props.currentPage) || 1)
const safePageSize = computed(() => Number(props.pageSize) || 20)
const safeTotalItems = computed(() => Number(props.totalItems) || 0)

const startItem = computed(() => (safeCurrentPage.value - 1) * safePageSize.value + 1)
const endItem = computed(() => Math.min(safeCurrentPage.value * safePageSize.value, safeTotalItems.value || safeCurrentPage.value * safePageSize.value))

function onPageSizeChange(value: any) {
  emit("page-size-change", parseInt(value))
}
</script>

<template>
  <div v-if="position === 'top'" class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between py-4 border-b">
    <div v-if="showResultsInfo" class="flex items-center space-x-2 text-sm text-muted-foreground">
      <span>Showing {{ startItem }}-{{ endItem }}{{ totalItems ? ` of ${totalItems}` : '' }} results</span>
    </div>
    <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
      <div v-if="showPageSizeSelector" class="flex items-center space-x-2">
        <span class="text-sm text-muted-foreground whitespace-nowrap">Show</span>
        <Select :model-value="pageSize.toString()" :disabled="isLoading" @update:model-value="onPageSizeChange">
          <SelectTrigger class="w-16 h-8"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="size in pageSizeOptions" :key="size" :value="size.toString()">{{ size }}</SelectItem>
          </SelectContent>
        </Select>
        <span class="text-sm text-muted-foreground whitespace-nowrap">per page</span>
      </div>
      <div v-if="totalPages > 1" class="flex items-center space-x-1">
        <Button variant="outline" size="sm" :disabled="currentPage <= 1 || isLoading" class="h-8 px-3" title="Previous page" @click="emit('page-change', currentPage - 1)">
          <ChevronLeft class="h-4 w-4 mr-1" />
          Prev
        </Button>
        <span class="text-sm text-muted-foreground px-3">Page {{ currentPage }} of {{ totalPages }}</span>
        <Button variant="outline" size="sm" :disabled="currentPage >= totalPages || isLoading" class="h-8 px-3" title="Next page" @click="emit('page-change', currentPage + 1)">
          Next
          <ChevronRight class="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  </div>

  <div v-else class="mt-10 flex flex-col space-y-4 pb-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
    <div v-if="showResultsInfo && position === 'standalone'" class="flex items-center space-x-2 text-sm text-muted-foreground">
      <span>Showing {{ startItem }}-{{ endItem }}{{ totalItems ? ` of ${totalItems}` : '' }} results</span>
    </div>
    <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
      <div v-if="showPageSizeSelector && position === 'standalone'" class="flex items-center space-x-2">
        <span class="text-sm text-muted-foreground whitespace-nowrap">Show</span>
        <Select :model-value="pageSize.toString()" :disabled="isLoading" @update:model-value="onPageSizeChange">
          <SelectTrigger class="w-16 h-8"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="size in pageSizeOptions" :key="size" :value="size.toString()">{{ size }}</SelectItem>
          </SelectContent>
        </Select>
        <span class="text-sm text-muted-foreground whitespace-nowrap">per page</span>
      </div>
      <div v-if="showJumpToPage && totalPages > 5" class="flex items-center space-x-2">
        <span class="text-sm text-muted-foreground whitespace-nowrap">Go to</span>
        <Input
          type="number"
          :min="1"
          :max="totalPages"
          v-model="jumpToPageInput"
          class="w-16 h-8"
          placeholder="Page"
          :disabled="isLoading"
          @keydown="handleKeydown"
        />
        <Button size="sm" variant="outline" :disabled="isLoading || !jumpToPageInput" class="h-8 px-2" @click="handleJumpToPage">Go</Button>
      </div>
      <div class="flex items-center space-x-1">
        <Button variant="outline" size="sm" :disabled="currentPage <= 1 || isLoading || totalPages <= 1" class="h-8 w-8 p-0" title="First page" @click="emit('page-change', 1)">
          <ChevronsLeft class="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" :disabled="currentPage <= 1 || isLoading || totalPages <= 1" class="h-8 w-8 p-0" title="Previous page" @click="emit('page-change', currentPage - 1)">
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <div v-if="totalPages > 1" class="flex items-center space-x-1">
          <template v-for="(page, index) in visiblePages" :key="index">
            <div v-if="page === '...'" class="flex h-8 w-8 items-center justify-center">
              <MoreHorizontal class="h-4 w-4" />
            </div>
            <Button
              v-else
              :variant="currentPage === page ? 'default' : 'outline'"
              size="sm"
              :disabled="isLoading"
              class="h-8 w-8 p-0"
              :title="`Page ${page}`"
              @click="emit('page-change', page as number)"
            >
              {{ page }}
            </Button>
          </template>
        </div>
        <div v-else class="flex items-center px-3">
          <span class="text-sm text-muted-foreground">Page 1 of 1</span>
        </div>
        <Button variant="outline" size="sm" :disabled="currentPage >= totalPages || isLoading || totalPages <= 1" class="h-8 w-8 p-0" title="Next page" @click="emit('page-change', currentPage + 1)">
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" :disabled="currentPage >= totalPages || isLoading || totalPages <= 1" class="h-8 w-8 p-0" title="Last page" @click="emit('page-change', totalPages)">
          <ChevronsRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
