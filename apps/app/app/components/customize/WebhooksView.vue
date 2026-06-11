<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Badge, Button, EmptyState, Input, Skeleton, Switch, Textarea } from '@hoshi/ui'
import { Check, Copy, Loader2, Plus, Trash2, Webhook } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface WebhookTrigger {
  id: string
  projectId: string | null
  name: string
  token: string
  prompt: string
  enabled: boolean
  hits: number
  lastTriggeredAt: string | null
  createdAt: string
}

const api = useApi()
const route = useRoute()
const config = useRuntimeConfig()
const { projects } = storeToRefs(useProjectsStore())

const webhooks = ref<WebhookTrigger[]>([])
const loading = ref(true)

const creating = ref(false)
const saving = ref(false)
const name = ref('')
const prompt = ref('')
const copiedId = ref<string | null>(null)

/** Webhooks created while a project is open file their sessions there. */
const projectId = computed(() => (route.params.id as string | undefined) ?? null)
const projectName = computed(() => projects.value.find((p) => p.id === projectId.value)?.name ?? null)

function projectLabel(id: string | null): string | null {
  if (!id) return null
  return projects.value.find((p) => p.id === id)?.name ?? 'a project'
}

function hookUrl(webhook: WebhookTrigger): string {
  return `${config.public.apiBase}/hooks/${webhook.token}`
}

onMounted(load)

async function load() {
  loading.value = true
  try {
    webhooks.value = (await api<{ webhooks: WebhookTrigger[] }>('/webhooks')).webhooks
  } catch {
    toast.error('Failed to load webhooks')
  } finally {
    loading.value = false
  }
}

async function create() {
  if (saving.value || !name.value.trim() || !prompt.value.trim()) return
  saving.value = true
  try {
    const res = await api<{ webhook: WebhookTrigger }>('/webhooks', {
      method: 'POST',
      body: {
        name: name.value.trim(),
        prompt: prompt.value.trim(),
        ...(projectId.value ? { projectId: projectId.value } : {}),
      },
    })
    webhooks.value = [...webhooks.value, res.webhook]
    creating.value = false
    name.value = ''
    prompt.value = ''
    toast.success('Webhook created')
  } catch (e: any) {
    toast.error(e?.data?.statusMessage ?? 'Failed to create the webhook')
  } finally {
    saving.value = false
  }
}

async function toggle(webhook: WebhookTrigger, enabled: boolean) {
  try {
    const res = await api<{ webhook: WebhookTrigger }>(`/webhooks/${webhook.id}`, {
      method: 'PATCH',
      body: { enabled },
    })
    webhooks.value = webhooks.value.map((w) => (w.id === webhook.id ? res.webhook : w))
  } catch {
    toast.error('Failed to update the webhook')
  }
}

async function remove(webhook: WebhookTrigger) {
  try {
    await api(`/webhooks/${webhook.id}`, { method: 'DELETE' })
    webhooks.value = webhooks.value.filter((w) => w.id !== webhook.id)
    toast.success('Webhook deleted')
  } catch {
    toast.error('Failed to delete the webhook')
  }
}

async function copyUrl(webhook: WebhookTrigger) {
  try {
    await navigator.clipboard.writeText(hookUrl(webhook))
  } catch {
    toast.error('Clipboard unavailable')
    return
  }
  copiedId.value = webhook.id
  setTimeout(() => {
    if (copiedId.value === webhook.id) copiedId.value = null
  }, 1500)
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="Webhook" title="Webhooks" :count="webhooks.length">
      <template #actions>
        <Button size="sm" variant="outline" class="gap-1.5" @click="creating = !creating">
          <Plus class="size-3.5" />
          New webhook
        </Button>
      </template>
    </CustomizeSectionHeader>

    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div class="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
        <!-- Create card -->
        <div
          v-if="creating"
          class="space-y-4 rounded-2xl border border-border/60 bg-card p-5 animate-in fade-in-0 zoom-in-[0.99] duration-150"
        >
          <div class="space-y-1.5">
            <label for="webhook-name" class="text-xs font-medium text-muted-foreground">Name</label>
            <Input id="webhook-name" v-model="name" placeholder="CI failure triage" maxlength="120" autofocus />
          </div>
          <div class="space-y-1.5">
            <label for="webhook-prompt" class="text-xs font-medium text-muted-foreground">Prompt</label>
            <Textarea
              id="webhook-prompt"
              v-model="prompt"
              rows="3"
              maxlength="4000"
              placeholder="A CI build failed. Investigate the payload below and propose a fix…"
            />
            <p class="text-xs text-muted-foreground/70">
              POSTing to the webhook URL starts a session on your machine{{ projectName ? ` in ${projectName}` : '' }} —
              the request body is appended to this prompt.
            </p>
          </div>
          <div class="flex justify-end gap-2">
            <Button size="sm" variant="ghost" @click="creating = false">Cancel</Button>
            <Button size="sm" class="gap-1.5" :disabled="saving || !name.trim() || !prompt.trim()" @click="create">
              <Loader2 v-if="saving" class="size-3.5 animate-spin" />
              Create webhook
            </Button>
          </div>
        </div>

        <!-- List -->
        <div v-if="loading" class="space-y-3">
          <Skeleton v-for="i in 3" :key="i" class="h-16 rounded-2xl" />
        </div>

        <EmptyState v-else-if="webhooks.length === 0 && !creating" :icon="Webhook" title="No webhooks yet" class="py-16">
          <template #description>Trigger a session from external events — CI failures, form submissions, alerts.</template>
          <template #action>
            <Button variant="outline" class="gap-1.5" @click="creating = true">
              <Plus class="size-3.5" />
              New webhook
            </Button>
          </template>
        </EmptyState>

        <div v-else class="space-y-3">
          <div
            v-for="webhook in webhooks"
            :key="webhook.id"
            class="flex items-center gap-4 rounded-2xl border border-border/60 bg-card px-5 py-4"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="truncate text-sm font-medium text-foreground">{{ webhook.name }}</span>
                <Badge v-if="webhook.hits > 0" variant="secondary" class="tabular-nums">{{ webhook.hits }} hits</Badge>
                <Badge v-if="projectLabel(webhook.projectId)" variant="outline" class="max-w-40 truncate">
                  {{ projectLabel(webhook.projectId) }}
                </Badge>
              </div>
              <p class="mt-1 truncate text-xs text-muted-foreground">{{ webhook.prompt }}</p>
              <button
                type="button"
                class="mt-1.5 flex max-w-full cursor-pointer items-center gap-1.5 text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
                :title="hookUrl(webhook)"
                @click="copyUrl(webhook)"
              >
                <Check v-if="copiedId === webhook.id" class="size-3 shrink-0" />
                <Copy v-else class="size-3 shrink-0" />
                <span class="truncate font-mono">{{ hookUrl(webhook) }}</span>
              </button>
            </div>
            <Switch
              :model-value="webhook.enabled"
              :aria-label="webhook.enabled ? 'Disable webhook' : 'Enable webhook'"
              @update:model-value="(value) => toggle(webhook, Boolean(value))"
            />
            <Button
              variant="ghost"
              size="icon"
              class="size-8 text-muted-foreground hover:text-foreground"
              aria-label="Delete webhook"
              @click="remove(webhook)"
            >
              <Trash2 class="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
