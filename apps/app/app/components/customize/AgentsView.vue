<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Badge, Button, EntityAvatar, Input, Textarea } from '@hoshi/ui'
import { Bot, Loader2, Plus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { fetchGlobalConfig, patchGlobalConfig, type AgentOption } from '~/composables/useOpencode'

const props = defineProps<{ agents: AgentOption[] }>()
const emit = defineEmits<{ refresh: [] }>()

const items = computed(() =>
  props.agents.map((agent) => ({ id: agent.name, label: agent.name, sublabel: agent.description })),
)

/** Stored overrides from the machine's global config — the editable layer on
 *  top of built-in agents (whose prompts the API doesn't expose). */
const overrides = ref<Record<string, { description?: string; prompt?: string; model?: string }>>({})

onMounted(loadOverrides)

async function loadOverrides() {
  try {
    overrides.value = (await fetchGlobalConfig()).agent ?? {}
  } catch {
    /* form falls back to empty overrides */
  }
}

// ── Edit form (per selected agent) ───────────────────────────────────────────

const editingId = ref<string | null>(null)
const description = ref('')
const prompt = ref('')
const model = ref('')
const saving = ref(false)

function startEdit(id: string) {
  const override = overrides.value[id] ?? {}
  editingId.value = id
  description.value = override.description ?? props.agents.find((a) => a.name === id)?.description ?? ''
  prompt.value = override.prompt ?? ''
  model.value = override.model ?? ''
}

async function saveEdit() {
  if (!editingId.value || saving.value) return
  saving.value = true
  try {
    await patchGlobalConfig({
      agent: {
        [editingId.value]: {
          ...(description.value.trim() ? { description: description.value.trim() } : {}),
          ...(prompt.value.trim() ? { prompt: prompt.value.trim() } : {}),
          ...(model.value.trim() ? { model: model.value.trim() } : {}),
        },
      },
    })
    toast.success('Agent updated on your machine')
    editingId.value = null
    await loadOverrides()
    emit('refresh')
  } catch {
    toast.error('Failed to update the agent')
  } finally {
    saving.value = false
  }
}

// ── Create form ──────────────────────────────────────────────────────────────

const creating = ref(false)
const newName = ref('')

watch(creating, (open) => {
  if (open) {
    newName.value = ''
    description.value = ''
    prompt.value = ''
    model.value = ''
    editingId.value = null
  }
})

const validName = computed(() => /^[a-z0-9][a-z0-9-_]{0,63}$/.test(newName.value.trim()))

async function createAgent() {
  if (!validName.value || !prompt.value.trim() || saving.value) return
  saving.value = true
  try {
    await patchGlobalConfig({
      agent: {
        [newName.value.trim()]: {
          mode: 'primary',
          prompt: prompt.value.trim(),
          ...(description.value.trim() ? { description: description.value.trim() } : {}),
          ...(model.value.trim() ? { model: model.value.trim() } : {}),
        },
      },
    })
    toast.success(`Agent "${newName.value.trim()}" created on your machine`)
    creating.value = false
    await loadOverrides()
    emit('refresh')
  } catch {
    toast.error('Failed to create the agent')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <CustomizeListDetailSection :icon="Bot" title="Agents" :items="items" search-placeholder="Search agents…">
    <template #actions>
      <Button size="sm" variant="outline" class="gap-1.5" @click="creating = !creating">
        <Plus class="size-3.5" />
        New agent
      </Button>
    </template>
    <template #row="{ item }">
      <EntityAvatar :label="item.label" size="xs" />
      <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ item.label }}</span>
    </template>
    <template #detail="{ item }">
      <div class="mx-auto w-full max-w-3xl px-6 py-8">
        <!-- Create takes over the pane -->
        <div v-if="creating" class="space-y-4 rounded-2xl border border-border/60 bg-card p-5">
          <h2 class="text-base font-semibold text-foreground">New agent</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label for="agent-name" class="text-xs font-medium text-muted-foreground">Name</label>
              <Input id="agent-name" v-model="newName" placeholder="release-writer" autofocus />
              <p v-if="newName && !validName" class="text-xs text-destructive">
                Lowercase letters, digits, dashes — up to 64 characters.
              </p>
            </div>
            <div class="space-y-1.5">
              <label for="agent-model" class="text-xs font-medium text-muted-foreground">Model (optional)</label>
              <Input id="agent-model" v-model="model" placeholder="provider/model-id" class="font-mono" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label for="agent-description" class="text-xs font-medium text-muted-foreground">Description</label>
            <Input id="agent-description" v-model="description" placeholder="Writes release notes from merged PRs" />
          </div>
          <div class="space-y-1.5">
            <label for="agent-prompt" class="text-xs font-medium text-muted-foreground">System prompt</label>
            <Textarea id="agent-prompt" v-model="prompt" rows="6" placeholder="You are…" />
          </div>
          <div class="flex justify-end gap-2">
            <Button size="sm" variant="ghost" @click="creating = false">Cancel</Button>
            <Button size="sm" class="gap-1.5" :disabled="!validName || !prompt.trim() || saving" @click="createAgent">
              <Loader2 v-if="saving" class="size-3.5 animate-spin" />
              Create agent
            </Button>
          </div>
        </div>

        <template v-else>
          <div class="flex items-start gap-4">
            <EntityAvatar :label="item.label" size="lg" />
            <div class="min-w-0 flex-1 leading-tight">
              <div class="flex items-center gap-2">
                <h2 class="truncate text-lg font-semibold tracking-tight text-foreground">{{ item.label }}</h2>
                <Badge variant="secondary">primary</Badge>
                <Badge v-if="overrides[item.id]" variant="outline">customized</Badge>
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ item.sublabel || "Selectable in the composer's agent picker." }}
              </p>
            </div>
            <Button v-if="editingId !== item.id" size="sm" variant="outline" @click="startEdit(item.id)">Edit</Button>
          </div>

          <!-- Edit form -->
          <div v-if="editingId === item.id" class="mt-6 space-y-4 rounded-2xl border border-border/60 bg-card p-5">
            <div class="space-y-1.5">
              <label for="edit-description" class="text-xs font-medium text-muted-foreground">Description</label>
              <Input id="edit-description" v-model="description" />
            </div>
            <div class="space-y-1.5">
              <label for="edit-prompt" class="text-xs font-medium text-muted-foreground">System prompt</label>
              <Textarea
                id="edit-prompt"
                v-model="prompt"
                rows="8"
                :placeholder="overrides[item.id]?.prompt ? '' : 'Built-in prompt — write here to override it on your machine'"
              />
            </div>
            <div class="space-y-1.5">
              <label for="edit-model" class="text-xs font-medium text-muted-foreground">Model</label>
              <Input id="edit-model" v-model="model" placeholder="provider/model-id (empty = default)" class="max-w-sm font-mono" />
            </div>
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs text-muted-foreground/70">Saved into your machine's OpenCode config.</p>
              <div class="flex gap-2">
                <Button size="sm" variant="ghost" @click="editingId = null">Cancel</Button>
                <Button size="sm" class="gap-1.5" :disabled="saving" @click="saveEdit">
                  <Loader2 v-if="saving" class="size-3.5 animate-spin" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          <!-- Read view of the stored override -->
          <div v-else-if="overrides[item.id]?.prompt" class="mt-6">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Custom prompt</h3>
            <pre class="mt-2 whitespace-pre-wrap rounded-2xl border border-border/60 bg-card p-4 font-mono text-xs leading-relaxed text-muted-foreground">{{ overrides[item.id]!.prompt }}</pre>
          </div>
        </template>
      </div>
    </template>
  </CustomizeListDetailSection>
</template>
