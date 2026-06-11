<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button, Input, Textarea } from '@hoshi/ui'
import { Loader2, Plus, SquareSlash } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { patchGlobalConfig, type CommandOption } from '~/composables/useOpencode'

const props = defineProps<{ commands: CommandOption[] }>()
const emit = defineEmits<{ refresh: [] }>()

const items = computed(() =>
  props.commands.map((command) => ({ id: command.name, label: command.name, sublabel: command.description })),
)

function commandByName(name: string): CommandOption | undefined {
  return props.commands.find((command) => command.name === name)
}

// ── Create / edit (both write the machine's global config) ───────────────────

const creating = ref(false)
const editingId = ref<string | null>(null)
const newName = ref('')
const description = ref('')
const template = ref('')
const saving = ref(false)

watch(creating, (open) => {
  if (open) {
    newName.value = ''
    description.value = ''
    template.value = ''
    editingId.value = null
  }
})

const validName = computed(() => /^[a-z0-9][a-z0-9-_]{0,63}$/.test(newName.value.trim()))

function startEdit(id: string) {
  const command = commandByName(id)
  editingId.value = id
  description.value = command?.description ?? ''
  template.value = command?.template ?? ''
}

async function save(name: string) {
  if (saving.value || !template.value.trim()) return
  saving.value = true
  try {
    await patchGlobalConfig({
      command: {
        [name]: {
          template: template.value.trim(),
          ...(description.value.trim() ? { description: description.value.trim() } : {}),
        },
      },
    })
    toast.success(`/${name} saved on your machine`)
    creating.value = false
    editingId.value = null
    emit('refresh')
  } catch {
    toast.error('Failed to save the command')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <CustomizeListDetailSection :icon="SquareSlash" title="Commands" :items="items" search-placeholder="Search commands…">
    <template #actions>
      <Button size="sm" variant="outline" class="gap-1.5" @click="creating = !creating">
        <Plus class="size-3.5" />
        New command
      </Button>
    </template>
    <template #row="{ item }">
      <span class="inline-flex h-4 min-w-4 items-center justify-center rounded font-mono text-xs font-medium">/</span>
      <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ item.label }}</span>
    </template>
    <template #detail="{ item }">
      <div class="mx-auto w-full max-w-3xl px-6 py-8">
        <!-- Create takes over the pane -->
        <div v-if="creating" class="space-y-4 rounded-2xl border border-border/60 bg-card p-5">
          <h2 class="text-base font-semibold text-foreground">New command</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label for="command-name" class="text-xs font-medium text-muted-foreground">Name</label>
              <Input id="command-name" v-model="newName" placeholder="standup" class="font-mono" autofocus />
              <p v-if="newName && !validName" class="text-xs text-destructive">
                Lowercase letters, digits, dashes — up to 64 characters.
              </p>
            </div>
            <div class="space-y-1.5">
              <label for="command-description" class="text-xs font-medium text-muted-foreground">Description</label>
              <Input id="command-description" v-model="description" placeholder="Draft my standup update" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label for="command-template" class="text-xs font-medium text-muted-foreground">Template</label>
            <Textarea
              id="command-template"
              v-model="template"
              rows="6"
              class="font-mono"
              placeholder="Summarize my commits since yesterday. $ARGUMENTS"
            />
            <p class="text-xs text-muted-foreground/70">Use $ARGUMENTS where the text after /{{ newName || 'command' }} should land.</p>
          </div>
          <div class="flex justify-end gap-2">
            <Button size="sm" variant="ghost" @click="creating = false">Cancel</Button>
            <Button
              size="sm"
              class="gap-1.5"
              :disabled="!validName || !template.trim() || saving"
              @click="save(newName.trim())"
            >
              <Loader2 v-if="saving" class="size-3.5 animate-spin" />
              Create command
            </Button>
          </div>
        </div>

        <template v-else>
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <h2 class="font-mono text-lg font-semibold tracking-tight text-foreground">/{{ item.label }}</h2>
              <p v-if="item.sublabel" class="mt-1 text-sm text-muted-foreground">{{ item.sublabel }}</p>
            </div>
            <Button v-if="editingId !== item.id" size="sm" variant="outline" @click="startEdit(item.id)">Edit</Button>
          </div>

          <!-- Edit form -->
          <div v-if="editingId === item.id" class="mt-6 space-y-4 rounded-2xl border border-border/60 bg-card p-5">
            <div class="space-y-1.5">
              <label for="edit-command-description" class="text-xs font-medium text-muted-foreground">Description</label>
              <Input id="edit-command-description" v-model="description" />
            </div>
            <div class="space-y-1.5">
              <label for="edit-command-template" class="text-xs font-medium text-muted-foreground">Template</label>
              <Textarea id="edit-command-template" v-model="template" rows="8" class="font-mono" />
            </div>
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs text-muted-foreground/70">Saved into your machine's OpenCode config.</p>
              <div class="flex gap-2">
                <Button size="sm" variant="ghost" @click="editingId = null">Cancel</Button>
                <Button size="sm" class="gap-1.5" :disabled="!template.trim() || saving" @click="save(item.id)">
                  <Loader2 v-if="saving" class="size-3.5 animate-spin" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          <template v-else-if="commandByName(item.id)?.template">
            <h3 class="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Template</h3>
            <pre class="mt-2 whitespace-pre-wrap rounded-2xl border border-border/60 bg-card p-4 font-mono text-xs leading-relaxed text-muted-foreground">{{ commandByName(item.id)!.template }}</pre>
          </template>
        </template>
      </div>
    </template>
  </CustomizeListDetailSection>
</template>
