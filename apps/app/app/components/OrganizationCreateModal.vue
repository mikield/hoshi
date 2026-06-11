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
import { toast } from 'vue-sonner'

const open = defineModel<boolean>('open', { required: true })

const name = ref('')
const submitting = ref(false)
const { create } = useOrganizationsStore()

watch(open, (value) => {
  if (!value) {
    name.value = ''
    submitting.value = false
  }
})

async function handleSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed || submitting.value) return
  submitting.value = true
  try {
    await create(trimmed)
    open.value = false
    await navigateTo('/projects')
  } catch {
    toast.error('Failed to create the organization')
    submitting.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="gap-0 overflow-hidden p-0 sm:max-w-lg">
      <DialogHeader class="border-b border-border/60 px-6 pb-4 pt-6">
        <DialogTitle class="text-lg font-semibold tracking-tight">New organization</DialogTitle>
        <DialogDescription class="text-sm text-muted-foreground">
          A separate space with its own members and projects.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-1.5 px-6 py-5">
          <Label for="new-org-name">Organization name</Label>
          <Input id="new-org-name" v-model="name" placeholder="Acme Inc" maxlength="120" autofocus />
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/30 px-6 py-3">
          <Button type="button" variant="ghost" :disabled="submitting" @click="open = false">Cancel</Button>
          <Button type="submit" class="gap-1.5" :disabled="submitting || !name.trim()">
            <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
            <Plus v-else class="h-4 w-4" />
            Create organization
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
