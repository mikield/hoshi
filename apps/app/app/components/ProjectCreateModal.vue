<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  InfoBanner,
  Label,
  Switch,
} from '@hoshi/ui'
import { Github, Loader2, Plus, Sparkles } from 'lucide-vue-next'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean]; create: [name: string] }>()

const name = ref('')
const includeStarterSkills = ref(true)
const submitting = ref(false)

function resetAndClose() {
  name.value = ''
  includeStarterSkills.value = true
  submitting.value = false
  emit('update:open', false)
}

function onOpenChange(o: boolean) {
  if (!o) resetAndClose()
  else emit('update:open', o)
}

function handleSubmit() {
  const trimmed = name.value.replace(/[^a-zA-Z0-9._ -]+/g, '').trim()
  if (!trimmed) return
  submitting.value = true
  emit('create', trimmed)
  resetAndClose()
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent class="gap-0 overflow-hidden p-0 sm:max-w-lg">
      <DialogHeader class="border-b border-border/60 px-6 pt-6 pb-4">
        <DialogTitle class="text-lg font-semibold tracking-tight">New project</DialogTitle>
        <DialogDescription class="text-sm text-muted-foreground">
          A dedicated space for one company, product, or idea — set up for you.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-5 px-6 py-5">
          <InfoBanner tone="neutral" :icon="Sparkles" title="Start fresh">
            We set up your project with starter skills, ready to use. Nothing to configure.
          </InfoBanner>

          <div class="space-y-1.5">
            <Label for="new-project-name">Project name</Label>
            <Input
              id="new-project-name"
              v-model="name"
              placeholder="my-agi-company"
              autocapitalize="none"
              autocorrect="off"
              class="font-mono"
              autofocus
            />
          </div>

          <div class="flex items-start justify-between gap-4 rounded-2xl border border-border/60 px-3 py-3">
            <div class="min-w-0 space-y-1">
              <Label for="starter-skills">Starter skills</Label>
              <p class="text-xs leading-5 text-muted-foreground">
                Comes with ready-made skills for research, writing, documents, slides, data, and the web.
              </p>
            </div>
            <Switch id="starter-skills" v-model="includeStarterSkills" :disabled="submitting" />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="h-7 w-fit gap-1.5 px-2 text-xs text-muted-foreground"
            :disabled="submitting"
          >
            <Github class="h-3.5 w-3.5" />
            Already have code on GitHub? Import it
          </Button>
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
