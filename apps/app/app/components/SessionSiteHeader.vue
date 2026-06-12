<script setup lang="ts">
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  cn,
} from '@hoshi/ui'
import { MoreHorizontal, PanelRight, Trash2, SquarePen } from 'lucide-vue-next'

defineProps<{
  isSidePanelOpen?: boolean
}>()

const emit = defineEmits<{ 'toggle-side-panel': []; delete: []; 'new-session': [] }>()
</script>

<template>
  <!-- Floating actions overlaying the top edge of the session -->
  <div class="pointer-events-none absolute left-0 right-0 top-0 z-20">
    <div class="flex items-center justify-between px-3 pt-2 sm:px-4">
      <!-- Left: overflow menu -->
      <div class="pointer-events-auto flex items-center gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground" title="More actions">
              <MoreHorizontal class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" class="w-52">
            <DropdownMenuItem class="cursor-pointer" @select="emit('new-session')">
              <SquarePen class="h-4 w-4" />
              New session
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer" @select="emit('delete')">
              <Trash2 class="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Right: panel toggle -->
<!--      <div class="pointer-events-auto flex items-center gap-1.5">-->
<!--        <Button-->
<!--          variant="ghost"-->
<!--          size="icon"-->
<!--          :title="`${isSidePanelOpen ? 'Close' : 'Open'} panel (⌘I)`"-->
<!--          :class="cn(-->
<!--            'h-8 w-8 cursor-pointer transition-colors',-->
<!--            isSidePanelOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',-->
<!--          )"-->
<!--          @click="emit('toggle-side-panel')"-->
<!--        >-->
<!--          <PanelRight class="h-4 w-4" />-->
<!--        </Button>-->
<!--      </div>-->
    </div>
  </div>
</template>
