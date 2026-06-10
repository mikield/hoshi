<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@hoshi/ui'
import { Loader2, Plus } from 'lucide-vue-next'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean]; create: [name: string] }>()

const name = ref('')
const submitting = ref(false)

// Reset whenever the modal closes, regardless of who closed it (Cancel,
// overlay click, or the parent reacting to a failed create).
watch(
  () => props.open,
  (open) => {
    if (!open) {
      name.value = ''
      submitting.value = false
    }
  },
)

function onOpenChange(open: boolean) {
  emit('update:open', open)
}

function resetAndClose() {
  emit('update:open', false)
}

function handleSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed || submitting.value) return
  submitting.value = true
  emit('create', trimmed)
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent class="gap-0 overflow-hidden p-0 sm:max-w-lg">
      <DialogHeader class="border-b border-border/60 px-6 pb-4 pt-6">
        <DialogTitle class="text-lg font-semibold tracking-tight">New project</DialogTitle>
        <DialogDescription class="text-sm text-muted-foreground">
          A dedicated space for one company, product, or idea.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-1.5 px-6 py-5">
          <Label for="new-project-name">Project name</Label>
          <Input
            id="new-project-name"
            v-model="name"
            placeholder="My AGI company"
            maxlength="120"
            autofocus
          />
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/30 px-6 py-3">
          <Button type="button" variant="ghost" :disabled="submitting" @click="resetAndClose">Cancel</Button>
          <Button type="submit" class="gap-1.5" :disabled="submitting || !name.trim()">
            <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
            <Plus v-else class="h-4 w-4" />
            Create project
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
