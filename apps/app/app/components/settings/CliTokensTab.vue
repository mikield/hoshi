<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button, EmptyState, Input, Skeleton } from '@hoshi/ui'
import { Check, Copy, KeyRound, Loader2, Plus, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface ApiToken {
  id: string
  name: string
  prefix: string
  lastUsedAt: string | null
  createdAt: string
}

const api = useApi()

const tokens = ref<ApiToken[]>([])
const loading = ref(true)

const creating = ref(false)
const saving = ref(false)
const name = ref('')
/** The freshly minted secret — shown exactly once, until dismissed. */
const freshSecret = ref<string | null>(null)
const copied = ref(false)

onMounted(load)

async function load() {
  loading.value = true
  try {
    tokens.value = (await api<{ tokens: ApiToken[] }>('/tokens')).tokens
  } catch {
    toast.error('Failed to load tokens')
  } finally {
    loading.value = false
  }
}

async function create() {
  if (saving.value || !name.value.trim()) return
  saving.value = true
  try {
    const res = await api<{ token: ApiToken; secret: string }>('/tokens', {
      method: 'POST',
      body: { name: name.value.trim() },
    })
    tokens.value = [...tokens.value, res.token]
    freshSecret.value = res.secret
    creating.value = false
    name.value = ''
  } catch (e: any) {
    toast.error(e?.data?.statusMessage ?? 'Failed to create the token')
  } finally {
    saving.value = false
  }
}

async function revoke(token: ApiToken) {
  try {
    await api(`/tokens/${token.id}`, { method: 'DELETE' })
    tokens.value = tokens.value.filter((t) => t.id !== token.id)
    toast.success('Token revoked')
  } catch {
    toast.error('Failed to revoke the token')
  }
}

async function copySecret() {
  if (!freshSecret.value) return
  try {
    await navigator.clipboard.writeText(freshSecret.value)
  } catch {
    toast.error('Clipboard unavailable')
    return
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

function localDate(value: string | null): string {
  if (!value) return 'never'
  return new Date(`${value.replace(' ', 'T')}Z`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="min-w-0 max-w-full space-y-5 overflow-x-hidden p-4 pb-12 sm:space-y-6 sm:p-6 sm:pb-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="mb-1 text-lg font-semibold">CLI tokens</h3>
        <p class="text-sm text-muted-foreground">
          Personal access tokens for the CLI, scripts, and the desktop app. They inherit your permissions —
          send them as <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">Authorization: Bearer …</code>.
        </p>
      </div>
      <Button size="sm" variant="outline" class="shrink-0 gap-1.5" @click="creating = !creating">
        <Plus class="size-3.5" />
        New token
      </Button>
    </div>

    <!-- Fresh secret — visible exactly once -->
    <div v-if="freshSecret" class="space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <p class="text-sm font-medium text-foreground">Copy your token now — it won't be shown again.</p>
      <div class="flex items-center gap-2">
        <code class="min-w-0 flex-1 truncate rounded-lg border border-border/60 bg-background px-3 py-2 font-mono text-xs">{{ freshSecret }}</code>
        <Button size="sm" variant="outline" class="gap-1.5" @click="copySecret">
          <Check v-if="copied" class="size-3.5" />
          <Copy v-else class="size-3.5" />
          {{ copied ? 'Copied' : 'Copy' }}
        </Button>
      </div>
      <Button size="sm" variant="ghost" @click="freshSecret = null">Done — hide it</Button>
    </div>

    <!-- Create -->
    <div v-if="creating" class="flex items-end gap-3 rounded-2xl border border-border/60 bg-card p-4">
      <div class="min-w-0 flex-1 space-y-1.5">
        <label for="token-name" class="text-xs font-medium text-muted-foreground">Token name</label>
        <Input id="token-name" v-model="name" placeholder="MacBook CLI" maxlength="120" autofocus @keydown.enter="create" />
      </div>
      <Button size="sm" class="gap-1.5" :disabled="saving || !name.trim()" @click="create">
        <Loader2 v-if="saving" class="size-3.5 animate-spin" />
        Create
      </Button>
      <Button size="sm" variant="ghost" @click="creating = false">Cancel</Button>
    </div>

    <!-- List -->
    <div v-if="loading" class="space-y-2">
      <Skeleton v-for="i in 2" :key="i" class="h-14 rounded-2xl" />
    </div>

    <EmptyState v-else-if="tokens.length === 0 && !creating" :icon="KeyRound" title="No tokens yet">
      <template #description>Tokens you create will be listed here. They inherit your permissions.</template>
    </EmptyState>

    <div v-else class="space-y-2">
      <div
        v-for="token in tokens"
        :key="token.id"
        class="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3"
      >
        <KeyRound class="size-4 shrink-0 text-muted-foreground" />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="truncate text-sm font-medium text-foreground">{{ token.name }}</span>
            <code class="shrink-0 font-mono text-xs text-muted-foreground/60">{{ token.prefix }}…</code>
          </div>
          <p class="mt-0.5 text-xs text-muted-foreground/60">
            Created {{ localDate(token.createdAt) }} · last used {{ localDate(token.lastUsedAt) }}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="size-8 text-muted-foreground hover:text-foreground"
          aria-label="Revoke token"
          @click="revoke(token)"
        >
          <Trash2 class="size-3.5" />
        </Button>
      </div>
    </div>
  </div>
</template>
